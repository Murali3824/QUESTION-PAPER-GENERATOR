import Question from "../models/Question.js";
import userModel from "../models/userModel.js";

const getQuestions = async (filters, btLevel, type, count, userId) => {
    const questionField = type === "short" ? "shortQuestion" : "longQuestion";
    const matchQuery = {
        subjectCode: filters.subjectCode, // changed from filters.subject to filters.subjectCode
        branch: filters.branch,
        regulation: filters.regulation,
        year: filters.year.toString(),
        semester: parseInt(filters.semester),
        [questionField]: { $exists: true, $ne: "" },
        uploadedBy: userId, // Add this to filter questions by user
    };

    if (filters.unit) {
        matchQuery.unit = parseInt(filters.unit);
    }

    if (btLevel) {
        matchQuery.btLevel = parseInt(btLevel);
    }

    return await Question.aggregate([
        { $match: matchQuery },
        { $sample: { size: count || 100 } },
    ]);
};

const getRandomQuestionsWithConstraints = async (
    filters,
    config,
    type,
    userId
) => {
    const questions = [];
    const usedBtLevels = new Set();
    const availableBtLevels = Object.keys(config.btLevelCounts)
        .map(Number)
        .sort();

    if (config.useUnitWise) {
        const sortedUnits = Object.entries(config.unitCounts)
            .filter(([_, count]) => count > 0)
            .sort(([unitA], [unitB]) => parseInt(unitA) - parseInt(unitB));

        for (const [unit, unitCount] of sortedUnits) {
            let assignedBtLevel = null;

            for (const btLevel of availableBtLevels) {
                if (!usedBtLevels.has(btLevel)) {
                    assignedBtLevel = btLevel;
                    usedBtLevels.add(btLevel);
                    break;
                }
            }

            if (!assignedBtLevel) {
                console.warn(
                    `No available BT levels for unit ${unit}, trying fallback`
                );
                assignedBtLevel = availableBtLevels[0];
            }

            const unitFilters = { ...filters, unit: parseInt(unit) };
            const availableQuestions = await getQuestions(
                unitFilters,
                assignedBtLevel,
                type,
                unitCount,
                userId
            );

            if (availableQuestions.length > 0) {
                questions.push(...availableQuestions.slice(0, unitCount));
            } else {
                console.warn(
                    `No questions found for unit ${unit} with BT level ${assignedBtLevel}, attempting fallback`
                );

                for (const fallbackLevel of availableBtLevels) {
                    if (fallbackLevel !== assignedBtLevel) {
                        const fallbackQuestions = await getQuestions(
                            unitFilters,
                            fallbackLevel,
                            type,
                            unitCount,
                            userId
                        );
                        if (fallbackQuestions.length > 0) {
                            questions.push(...fallbackQuestions.slice(0, unitCount));
                            break;
                        }
                    }
                }
            }
        }
    } else {
        if (config.useBtLevels) {
            for (const [btLevel, count] of Object.entries(config.btLevelCounts)) {
                if (count <= 0) continue;

                const availableQuestions = await getQuestions(
                    filters,
                    parseInt(btLevel),
                    type,
                    count,
                    userId
                );
                questions.push(...availableQuestions.slice(0, count));
            }
        } else {
            const availableQuestions = await getQuestions(
                filters,
                null,
                type,
                config.totalCount,
                userId
            );
            questions.push(...availableQuestions.slice(0, config.totalCount));
        }
    }

    return questions;
};

const validateConfig = (config, type) => {
    if (!config[type].useUnitWise && config[type].useBtLevels) {
        const totalBtCount = Object.values(config[type].btLevelCounts).reduce(
            (a, b) => a + b,
            0
        );
        if (totalBtCount !== config[type].totalCount) {
            throw new Error(
                `Total count (${config[type].totalCount}) must match sum of BT level counts (${totalBtCount}) for ${type} questions`
            );
        }
    }

    if (config[type].useUnitWise) {
        const totalUnitCount = Object.values(config[type].unitCounts).reduce(
            (a, b) => a + b,
            0
        );
        if (config[type].useBtLevels) {
            const totalBtCount = Object.values(config[type].btLevelCounts).reduce(
                (a, b) => a + b,
                0
            );
            if (totalUnitCount !== totalBtCount) {
                throw new Error(
                    `Total unit-wise count (${totalUnitCount}) must match total BT level count (${totalBtCount}) for ${type} questions`
                );
            }
        }
    }
};

export const generatePaper = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        // Log the incoming request
        // console.log("Request body:", JSON.stringify(req.body, null, 2));

        if (!user) {
            return res.status(401).json({
                error: "User not found. Please log in again.",
            });
        }

        if (!user.isAccountVerified) {
            return res.status(401).json({
                error: "Please verify your account before generating a paper.",
            });
        }

        const {
            fileId,
            subject,
            branch,
            regulation,
            year,
            semester,
            unit,
            config,
        } = req.body;

        if (!fileId) {
            return res.status(400).json({ error: "File ID is required" });
        }

        const file = user.uploadedFiles.id(fileId);
        // console.log("Found file:", file ? "yes" : "no");
        // console.log("Questions in file:", file?.questions?.length || 0);

        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        // Validate that the file has questions
        if (!file.questions || file.questions.length === 0) {
            return res.status(400).json({
                error:
                    "Selected file contains no questions. Please upload questions first.",
            });
        }

        // Log request parameters for debugging
        // console.log("Generation request:", {
        //     fileId,
        //     subject,
        //     branch,
        //     regulation,
        //     year,
        //     semester,
        //     unit,
        //     config,
        // });

        validateConfig(config, "short");
        validateConfig(config, "long");

        const filters = {
            _id: { $in: file.questions },
            subjectCode: subject,
            branch,
            regulation,
            year: year.toString(),
            semester: parseInt(semester),
            uploadedBy: userId,
        };
        // Log the filter criteria
        // console.log("Search filters:", JSON.stringify(filters, null, 2));

        if (unit) {
            filters.unit = parseInt(unit);
        }

        // Log the filters being used
        // console.log("Searching with filters:", JSON.stringify(filters, null, 2));

        // First check if any questions exist with these filters
        const availableQuestions = await Question.find(filters).select(
            "_id shortQuestion longQuestion btLevel unit"
        );

        // console.log(
        //     `Found ${availableQuestions.length} total questions matching filters`
        // );

        // Log breakdown of available questions
        const shortQuestions = availableQuestions.filter((q) => q.shortQuestion);
        const longQuestions = availableQuestions.filter((q) => q.longQuestion);

        // console.log("Available questions breakdown:", {
        //     totalQuestions: availableQuestions.length,
        //     shortQuestions: shortQuestions.length,
        //     longQuestions: longQuestions.length,
        // });

        if (availableQuestions.length === 0) {
            return res.status(404).json({
                error:
                    "No questions found matching your criteria in your question bank.",
                details: {
                    filters: filters,
                    fileId: fileId,
                    requestedCounts: {
                        short: config.short.totalCount,
                        long: config.long.totalCount,
                    },
                },
            });
        }

        // Check if questions exist before attempting to generate
        // First check if any questions exist
        const questionCount = await Question.countDocuments(filters);
        // console.log("Matching questions count:", questionCount);

        if (questionCount === 0) {
            // Log a sample question to see what data looks like
            const sampleQuestion = await Question.findOne({
                _id: { $in: file.questions },
            });
            // console.log("Sample question from file:", sampleQuestion);

            return res.status(404).json({
                error:
                    "No questions found matching your criteria in your question bank.",
                details: {
                    filters,
                    questionCount,
                    fileQuestionsCount: file.questions.length,
                },
            });
        }

        const shortAnswers = await getRandomQuestionsWithConstraints(
            filters,
            config.short,
            "short",
            userId
        );
        const longAnswers = await getRandomQuestionsWithConstraints(
            filters,
            config.long,
            "long",
            userId
        );

        if (shortAnswers.length === 0 && longAnswers.length === 0) {
            return res.status(404).json({
                error:
                    "No questions found matching your criteria in your question bank.",
                details: {
                    shortAnswersCount: shortAnswers.length,
                    longAnswersCount: longAnswers.length,
                    filters,
                },
            });
        }

        const subjectInfo = await Question.findOne({
            subjectCode: subject,
            uploadedBy: userId,
        });

        if (!subjectInfo) {
            return res.status(404).json({
                error: "Subject not found in your question bank.",
            });
        }

        const response = {
            metadata: {
                fileId,
                filename: file.filename,
                subjectCode: subject,
                subject: subjectInfo.subject,
                branch,
                regulation,
                year,
                semester,
                unit,
                totalQuestions: shortAnswers.length + longAnswers.length,
                generatedBy: user.email,
                generatedAt: new Date().toISOString(),
            },
            shortAnswers: shortAnswers.map((q, index) => ({
                number: index + 1,
                question: q.shortQuestion,
                btLevel: q.btLevel,
                unit: q.unit,
            })),
            longAnswers: longAnswers.map((q, index) => ({
                number: index + 1,
                question: q.longQuestion,
                btLevel: q.btLevel,
                unit: q.unit,
            })),
        };

        return res.json(response);
    } catch (error) {
        console.error("Generate paper error:", error);
        return res.status(500).json({
            error: error.message || "Failed to generate paper",
            details: error.stack,
        });
    }
};

export const getSubjectsByFile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fileId } = req.params;

        if (!fileId) {
            return res.status(400).json({ error: "File ID is required" });
        }

        const user = await userModel.findById(userId);
        const file = user.uploadedFiles.id(fileId);

        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }

        const questions = await Question.find({
            _id: { $in: file.questions },
        });

        const subjects = questions.reduce((acc, question) => {
            const key = question.subjectCode;
            if (!acc[key]) {
                acc[key] = {
                    subjectCode: question.subjectCode,
                    subject: question.subject,
                    branch: question.branch,
                    regulation: question.regulation,
                    year: new Set([question.year]),
                    semester: new Set([question.semester]),
                };
            } else {
                acc[key].year.add(question.year);
                acc[key].semester.add(question.semester);
            }
            return acc;
        }, {});

        const formattedSubjects = Object.values(subjects).map((s) => ({
            ...s,
            year: [...s.year],
            semester: [...s.semester],
        }));

        return res.json({ subjects: formattedSubjects });
    } catch (error) {
        console.error("Fetch subjects error:", error);
        return res.status(500).json({ error: "Failed to fetch subjects" });
    }
};
