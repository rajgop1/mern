const mongoose = require('mongoose')
require("dotenv").config()
const DATABASE = process.env.DATABASE 
mongoose.connect(DATABASE, {useNewUrlParser: true, useUnifiedTopology: true})
const {StudentReceipt} = require("./models/Receipt")

const data = new StudentReceipt(
    {
        receiptNumber: '1',
        registrationNumber: '1',        
        studentName: 'SANJANA',
        fatherName: 'HARI',
        dob: '2000-02-10',
        addmissionDate: '2022-02-02',   
        course: 'CCB',
        feesPaymentMethod: 'ONE TIME',  
        totalFees: '3000',
        paidFees: '3000'
      }  
) 
data.save()