import xlsx from "xlsx";
import Question from "../models/Question.js";
import userModel from "../models/userModel.js";

export const uploadQuestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (!user || !user.isAccountVerified) {
            return res.status(401).json({ error: "Unauthorized or unverified account" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "File is required" });
        }

        // Process Excel file
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        console.log('Raw Excel data first row:', data[0]);

        if (data.length === 0) {
            return res.status(400).json({ error: "Excel file is empty" });
        }

        // Validate required fields
        const requiredFields = [
            "Subject Code", "Subject", "Branch", "Regulation", "Year", "Sem", "Month", "Unit", "B.T Level"
        ];

        const missingFields = requiredFields.filter(
            (field) => !data[0].hasOwnProperty(field)
        );

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Excel file is missing required headers",
                missingHeaders: missingFields,
            });
        }

        // Process and validate data with strict type checking
        const questions = data.map((row, index) => {
            // Validate and clean each field
            const question = {
                subjectCode: String(row["Subject Code"] || "").trim(),
                subject: String(row["Subject"] || "").trim(),
                branch: String(row["Branch"] || "").trim(),
                regulation: String(row["Regulation"] || "").trim(),
                year: String(row["Year"] || "").trim(),
                semester: Number(row["Sem"]),
                examMonth: String(row["Month"] || "").trim(),
                serialNo: Number(row["S.No."]) || 0,
                shortQuestion: String(row["Short Questions"] || "").trim(),
                longQuestion: String(row["Long Questions"] || "").trim(),
                unit: Number(row["Unit"]),
                btLevel: Number(row["B.T Level"]),
                uploadedBy: userId,
            };

            // Validate required fields
            if (!question.subjectCode || !question.subject || !question.branch) {
                throw new Error(`Row ${index + 1}: Missing required fields`);
            }

            // Validate numeric fields
            if (isNaN(question.semester) || question.semester < 1) {
                throw new Error(`Row ${index + 1}: Invalid semester value`);
            }
            if (isNaN(question.unit) || question.unit < 1) {
                throw new Error(`Row ${index + 1}: Invalid unit value`);
            }
            if (isNaN(question.btLevel) || question.btLevel < 1) {
                throw new Error(`Row ${index + 1}: Invalid B.T Level value`);
            }

            // Log processed question
            console.log(`Processed question ${index + 1}:`, {
                subjectCode: question.subjectCode,
                branch: question.branch,
                regulation: question.regulation,
                year: question.year,
                semester: question.semester
            });

            return question;
        });

        // Verify we have valid questions
        if (questions.length === 0) {
            return res.status(400).json({ error: "No valid questions found in file" });
        }

        // Delete existing questions for this subject code uploaded by this user
        const subjectCode = questions[0].subjectCode;
        await Question.deleteMany({ subjectCode, uploadedBy: userId });

        // Save questions and get their IDs
        const insertedQuestions = await Question.insertMany(questions);
        console.log(`Successfully inserted ${insertedQuestions.length} questions`);

        // Create new file entry
        const newFile = {
            filename: req.file.originalname,
            uploadDate: new Date(),
            description: req.body.description || "",
            questions: insertedQuestions.map(q => q._id)
        };

        // Update user with uploaded questions
        user.uploadedQuestions = [
            ...user.uploadedQuestions,
            ...insertedQuestions.map((q) => q._id),
        ];

        // Add new file to user's uploadedFiles
        user.uploadedFiles.push(newFile);
        await user.save();

        return res.json({
            success: true,
            message: "File uploaded successfully",
            fileId: newFile._id,
            questionsCount: questions.length,
            sampleQuestion: {
                subjectCode: questions[0].subjectCode,
                branch: questions[0].branch,
                regulation: questions[0].regulation,
                year: questions[0].year,
                semester: questions[0].semester
            }
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            error: error.message || "Failed to process file",
            details: error.stack
        });
    }
};

// New controller for saving generated papers
export const savePaper = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, paperData, fileId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const newPaper = {
            title,
            generatedDate: new Date(),
            metadata: paperData.metadata,
            shortAnswers: paperData.shortAnswers,
            longAnswers: paperData.longAnswers,
            generatedFrom: fileId,
        };

        user.savedPapers.push(newPaper);
        await user.save();

        return res.json({
            success: true,
            message: "Paper saved successfully",
            paperId: newPaper._id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// Controller to get user's saved papers
export const getSavedPapers = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel
            .findById(userId)
            .select("savedPapers")
            .populate("savedPapers.generatedFrom");

        return res.json({
            success: true,
            papers: user.savedPapers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

export const deleteSavedPaper = async (req, res) => {
    try {
        const userId = req.user._id;
        const { paperId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Find and remove the paper from savedPapers array
        const paperIndex = user.savedPapers.findIndex(
            paper => paper._id.toString() === paperId
        );

        if (paperIndex === -1) {
            return res.status(404).json({ error: "Paper not found" });
        }

        // Remove the paper
        user.savedPapers.splice(paperIndex, 1);
        await user.save();

        return res.json({
            success: true,
            message: "Paper deleted successfully"
        });
    } catch (error) {
        console.error("Delete paper error:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const getUploadedFiles = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId).select("uploadedFiles");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({
            success: true,
            files: user.uploadedFiles,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
