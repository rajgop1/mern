const mongoose = require('mongoose');

const paidFeesSchema = mongoose.Schema({
    receiptNumber: {
        type: Number,
    },
    feesAll: {
        type: String,
    },
    date: {
        type: Date
    },
    remark: {
        type: String
    }
})

const ReceiptScehma = mongoose.Schema({
    receiptNumber: {
        type: Number,
        required: true,
    },
    registrationNumber: {
        type: String,
        unique: true,
    },
    studentName: {
        type: String,
        required: true,
        uppercase: true
    },
    fatherName: {
        type: String,
        required: true,
        uppercase: true
    },
    dob: {
        type: Date,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    totalFees: {
        type: Number,
        required: true,
    },
    feesPaymentMethod: {
        type: String,
        required: true,
    },
    paidFees: [paidFeesSchema],
    addmissionDate: {
        type: Date
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    }
})

const StudentReceipt = mongoose.model('StudentReceipt',ReceiptScehma)
module.exports = {StudentReceipt}