import xlsx from "xlsx";
import Question from "../models/Question.js";
import userModel from "../models/userModel.js";

export const uploadQuestions = async (req, res) => {
    try {
        // Check if user exists and is verified
        const userId = req.body.userId;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(401).json({ 
                error: "User not found. Please log in again." 
            });
        }
        
        if (!user.isAccountVerified) {
            return res.status(401).json({ 
                error: "Please verify your account before uploading files." 
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: "File is required" });
        }

        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return res.status(400).json({ error: "Excel file is empty" });
        }

        // Process and validate data
        const questions = data.map((row) => ({
            subjectCode: String(row["Subject Code"] || ""),
            subject: String(row["Subject"] || ""),
            branch: String(row["Branch"] || ""),
            regulation: String(row["Regulation"] || ""),
            year: String(row["Year"] || ""),
            semester: parseInt(row["Sem"]) || 0,
            examMonth: String(row["Month"] || ""),
            serialNo: parseInt(row["S.No."]) || 0,
            shortQuestion: String(row["Short Questions"] || ""),
            longQuestion: String(row["Long Questions"] || ""),
            unit: parseInt(row["Unit"]) || 0,
            btLevel: parseInt(row["B.T Level"]) || 0,
            uploadedBy: userId  // Add the user ID to each question
        }));

        // Validate required fields
        const requiredFields = [
            "Subject Code", "Subject", "Branch", "Regulation", 
            "Year", "Sem", "Month", "Unit", "B.T Level"
        ];
        
        const missingFields = [];
        for (const field of requiredFields) {
            if (!data[0].hasOwnProperty(field)) {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Excel file is missing required headers",
                missingHeaders: missingFields
            });
        }

        // Delete existing questions for this subject code uploaded by this user
        const subjectCode = questions[0].subjectCode;
        await Question.deleteMany({ subjectCode, uploadedBy: userId });

        // Insert the new questions
        const insertedQuestions = await Question.insertMany(questions);
        
        // Update user's uploadedQuestions array
        const questionIds = insertedQuestions.map(q => q._id);
        await userModel.findByIdAndUpdate(
            userId,
            { $push: { uploadedQuestions: { $each: questionIds } } }
        );

        return res.json({
            success: true,
            message: "Questions uploaded successfully!",
            count: questions.length,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message || "Failed to process file",
        });
    }
};