import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: true,
        index: true
    },
    subject: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    regulation: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    examMonth: {
        type: String,
        required: true
    },
    serialNo: {
        type: Number,
        required: true
    },
    shortQuestion: String,
    longQuestion: String,
    unit: {
        type: Number,
        required: true
    },
    btLevel: {
        type: Number,
        required: true
    },
    // Add reference to the user who uploaded this question
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model("Question", QuestionSchema);