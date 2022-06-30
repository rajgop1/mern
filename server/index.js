const express = require('express')
const app = express()
require("dotenv").config()
const cors = require('cors')
const PORT = process.env.PORT || 8080
const mongoose = require('mongoose')
const DATABASE = process.env.DATABASE
const { StudentReceipt } = require("./models/Receipt")

mongoose.connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.post("/add", async function (req, res) {
    const data = req.body.formData
    const paidFees = data.paidFees
    const dobDate = new Date(data.dob)
    const addmissionDate = new Date(data.addmissionDate)
    const newFeeInfo = { receiptNumber: data.receiptNumber, feesAll: paidFees, date: addmissionDate }
    const newData = await new StudentReceipt({ ...data, dob: dobDate, addmissionDate: addmissionDate, paidFees: [newFeeInfo] }).save().then((result) => {
        console.log(result)
    }).catch((error) => { console.log(error) })
    const result = await fetchStudentData({})
    res.send(result)
    console.log(result)
})

async function fetchStudentData() {
    const allStudentDetails = await StudentReceipt.find({})
    const allstu = allStudentDetails.map(d => {
        let dobmonth = (d.dob.getMonth() + 1)
        dobmonth = addZero(dobmonth)
        let dobyear = (d.dob.getFullYear())
        let dobday = (d.dob.getDate())
        dobday = addZero(dobday)
        let dobdate = dobyear + "-" + dobmonth + "-" + dobday
        let addmonth = (d.addmissionDate.getMonth() + 1)
        addmonth = addZero(addmonth)
        let addyear = (d.addmissionDate.getFullYear())
        let addday = (d.addmissionDate.getDay())
        addday = addZero(addday)
        let adddate = addyear + "-" + addmonth + "-" + addday
        return { ...d._doc, dob: dobdate, addmissionDate: adddate }
    })
    return allstu
}

app.get("/getStudentDetails", async (req, res) => {
    const result = await fetchStudentData()
    res.send(result)
})

app.post('/delete', async (req, res) => {
    const { id } = req.body
    const findData = await StudentReceipt.findByIdAndDelete(id)
    const result = await fetchStudentData()
    res.send(result)
})

function addZero(data) {
    let newData = ""
    if (data < 10) {
        newData = "0" + data
    } else {
        newData = data
    }
    return newData
}

app.post("/fee", async (req, res) => {
    const data = req.body
    const { id, fee } = data

    const newFee = { receiptNumber: fee.receiptNumber, feesAll: fee.fee, date: fee.dateOfFeesPaid, remark: fee.remark }
    const allData = await StudentReceipt.findById(id)
    const prevFees = allData.paidFees
    const update = await StudentReceipt.findByIdAndUpdate(id, { paidFees: [...prevFees, newFee] })
    const fetchResults = await StudentReceipt.findById(id)
    const prevFeesAfter = fetchResults.paidFees
    let sumOfFees = 0
    prevFeesAfter.map(fee => sumOfFees += Number(fee.feesAll))
    res.send({ paidFees: fetchResults.paidFees, total: sumOfFees })
})

app.get("/getFees", async (req, res) => {
    const { id } = req.query
    const feedata = await getFees(id)
    res.send(feedata)
})

app.post('/deleteFee', async (req, res) => {
    const { studentId, feeId } = req.body
    const studentInfo = await StudentReceipt.findById(studentId)
    const allFees = studentInfo.paidFees
    const remainingFees = allFees.filter(fee => fee._id != feeId)
    // console.log(studentId, feeId, remainingFees)
    const updatedData = await StudentReceipt.findByIdAndUpdate(studentId, { paidFees: remainingFees })
    const getFee = await getFees(studentId)
    res.send(getFee)
})

async function getFees(id) {
    console.log(id)
    const allData = await StudentReceipt.findById(id)
    const prevFees = allData.paidFees
    console.log(prevFees)
    let sumOfFees = 0
    prevFees.map(fee => sumOfFees += Number(fee.feesAll))
    return ({ paidFees: prevFees, total: sumOfFees })
}

app.get("/getFeeInfo", async function (req, res) {
    const id = req.query.id
    const studentId = req.query.studentId
    const foundData = await StudentReceipt.findById(studentId)
    const feeData = foundData.paidFees
    const requestedFee = feeData.find(fee => fee._id == id)
    console.log(requestedFee)
    res.send(requestedFee)
})

app.get("/getMonthlyReport", async (req, res) => {
    const { month, year } = req.query
    const data = await StudentReceipt.find({})
    const sendData = []
    data.map(fees => {
        fees.paidFees.map(f => {
            const date = f.date
            const fetchedMonth = date.getMonth()+1
            const fetchedYear = date.getFullYear()
            
            if (fetchedMonth == month && fetchedYear == year) {
                
                console.log(f.feesAll, fees.studentName, fees.registrationNumber, fees._id)
                sendData.push({fee: f.feesAll, name: fees.studentName,reg: fees.registrationNumber, id: fees._id})
            } else {
                // console.log("no")
            }
            
        })
    })
    res.send(sendData)

})

app.listen(PORT, () => {
    console.log("listening on port " + PORT)
})
