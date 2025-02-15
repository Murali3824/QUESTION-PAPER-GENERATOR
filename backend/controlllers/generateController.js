import Question from "../models/Question.js";
import userModel from "../models/userModel.js";

const getQuestions = async (filters, btLevel, type, count) => {
    const questionField = type === "short" ? "shortQuestion" : "longQuestion";
    const matchQuery = {
        subjectCode: filters.subject,
        branch: filters.branch,
        regulation: filters.regulation,
        year: filters.year.toString(),
        semester: parseInt(filters.semester),
        [questionField]: { $exists: true, $ne: "" },
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

const getRandomQuestionsWithConstraints = async (filters, config, type) => {
    const questions = [];
    const usedBtLevels = new Set();
    const availableBtLevels = Object.keys(config.btLevelCounts).map(Number).sort();

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
                console.warn(`No available BT levels for unit ${unit}, trying fallback`);
                assignedBtLevel = availableBtLevels[0]; // Fallback to the first available BT level
            }

            const unitFilters = { ...filters, unit: parseInt(unit) };
            const availableQuestions = await getQuestions(unitFilters, assignedBtLevel, type, unitCount);

            if (availableQuestions.length > 0) {
                questions.push(...availableQuestions.slice(0, unitCount));
            } else {
                console.warn(`No questions found for unit ${unit} with BT level ${assignedBtLevel}, attempting fallback`);
                
                // Try another available BT level
                for (const fallbackLevel of availableBtLevels) {
                    if (fallbackLevel !== assignedBtLevel) {
                        const fallbackQuestions = await getQuestions(unitFilters, fallbackLevel, type, unitCount);
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
                
                const availableQuestions = await getQuestions(filters, parseInt(btLevel), type, count);
                questions.push(...availableQuestions.slice(0, count));
            }
        } else {
            const availableQuestions = await getQuestions(filters, null, type, config.totalCount);
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
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(401).json({ 
                error: "User not found. Please log in again." 
            });
        }
        
        if (!user.isAccountVerified) {
            return res.status(401).json({ 
                error: "Please verify your account before generating a paper." 
            });
        }
        
        const { subject, branch, regulation, year, semester, unit, config } = req.body;

        // Validate required fields
        const requiredFields = [
            "subject",
            "branch",
            "regulation",
            "year",
            "semester",
            "config",
        ];
        const missingFields = requiredFields.filter((field) => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(", ")}`,
            });
        }

        // Log paper generation attempt
        console.log(`User ${user.email} generating paper for subject ${subject}`);

        // Validate configurations
        validateConfig(config, "short");
        validateConfig(config, "long");

        const filters = { subject, branch, regulation, year, semester };
        if (unit) filters.unit = unit;

        const shortAnswers = await getRandomQuestionsWithConstraints(
            filters,
            config.short,
            "short"
        );
        const longAnswers = await getRandomQuestionsWithConstraints(
            filters,
            config.long,
            "long"
        );

        const subjectInfo = await Question.findOne({ subjectCode: subject });
        if (!subjectInfo) {
            throw new Error("Subject not found");
        }

        // Add user info and timestamp to response
        const response = {
            metadata: {
                subjectCode: subject,
                subject: subjectInfo.subject,
                branch,
                regulation,
                year,
                semester,
                unit,
                totalQuestions: shortAnswers.length + longAnswers.length,
                generatedBy: user.email,
                generatedAt: new Date().toISOString()
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
        });
    }
};

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Question.aggregate([
            {
                $group: {
                    _id: "$subjectCode",
                    subjectCode: { $first: "$subjectCode" },
                    subject: { $first: "$subject" },
                    branch: { $first: "$branch" },
                    regulation: { $first: "$regulation" },
                    year: { $addToSet: "$year" },
                    semester: { $addToSet: "$semester" },
                },
            },
            {
                $project: {
                    _id: 0,
                    subjectCode: 1,
                    subject: 1,
                    branch: 1,
                    regulation: 1,
                    year: 1,
                    semester: 1,
                },
            },
            { $sort: { branch: 1, subject: 1 } },
        ]);

        if (!subjects || subjects.length === 0) {
            return res.status(404).json({ error: "No subjects found" });
        }

        return res.json({ subjects });
    } catch (error) {
        console.error("Fetch subjects error:", error);
        return res.status(500).json({ error: "Failed to fetch subjects" });
    }
};