import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyOtp: {
        type: String,
        default: ''
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    },
    // Add reference to uploaded questions
    uploadedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    // Field to store uploaded file (specific to user)
    uploadedFiles: [{
        filename: String,
        uploadDate: Date,
        description: String,
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }]
    }],
    savedPapers: [{
        title: String,
        generatedDate: Date,
        metadata: {
            subjectCode: String,
            subject: String,
            branch: String,
            regulation: String,
            year: String,
            semester: Number,
            unit: String
        },
        shortAnswers: [{
            number: Number,
            question: String,
            btLevel: Number,
            unit: Number
        }],
        longAnswers: [{
            number: Number,
            question: String,
            btLevel: Number,
            unit: Number
        }],
        // Changed to store the fileId from uploadedFiles array
        generatedFrom: String // This will store the _id of the uploadedFiles subdocument
    }]
}, {
    timestamps: true
});

// Add a method to find an uploaded file by its ID
userSchema.methods.findUploadedFileById = function(fileId) {
    return this.uploadedFiles.id(fileId);
};

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;