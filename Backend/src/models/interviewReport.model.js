const mongoose = require('mongoose')

/**
 * -job decription Schema : String
 * -resume text : String 
 * -self description :String
 * 
 * - matchScore : Number
 * 
 * -Techinical questions  :
 *          [{
 *          question :"",
 *          intension : "",
 *          answer : ""
 *          }] 
 * -Behavioral questions  :
 *          [{
 *          question :"",
 *          intension : "",
 *          answer : ""
 *          }]
 * -Skill gaps : [{
 *          skill:"",
 *          severity:{
 *              type:String,
 *              enum :["low,"medium","high"]
 * }
 * }]
 * -Preparation plan : [{
 *          day:number,
 *          focus:String,
 *          tasks:[String]
 * }]
*/

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical Question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intension is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},{
    _id:false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical Question is required"]
    },
    intention:{
        type:String,
        required:[true,"Intension is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},{
    _id:false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:['low','medium','high'],
        required:[true,"Severity is required"]
    }
},{
    _id:false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is required"]
    },
    tasks:[{
        type:String,
        required:[true,'Task is required']
    }]
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required :[true,"job description is required"]
    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestion:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema]
},{
    timestamps:true
})

const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema)

module.exports = interviewReportModel;