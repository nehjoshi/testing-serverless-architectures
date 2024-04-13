const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');
const UserModel = require('./model/User.js');
const failureLambda = require('failure-lambda');
const AWS = require('aws-sdk');

mongoose.Promise = Promise;

const mongoString = 'mongodb+srv://admin-jivsaf:admin-jivsaf@jivan-safalya.k7ghr.mongodb.net/The_Mirror_Test'; // MongoDB Url

const ssm = new AWS.SSM();

async function getParameterValue(parameterName) {
    try {
        const response = await ssm.getParameter({ Name: parameterName }).promise();
        return response.Parameter.Value;
    } catch (error) {
        console.error('Error retrieving parameter:', error);
        throw error;
    }
}

const createErrorResponse = (statusCode, message) => ({
    statusCode: statusCode || 501,
    headers: { 'Content-Type': 'text/plain' },
    body: message || 'Incorrect id',
});

// const dbExecute = (db, fn) => db.then(fn).finally(() => db.close());

async function dbConnectAndExecute(dbUrl) {
    console.log(dbUrl);
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected");
        // return true;
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

// exports.handler = failureLambda(async (event, context, callback) => {

//     const lambda = new AWS.Lambda();
//     const failureLambdaParam = process.env.FAILURE_INJECTION_PARAM;
//     const parameterValue = await getParameterValue("failureLambdaParam");
//     const params = {
//         FunctionName: 'hello_world', // Replace with the name of the target Lambda function
//         InvocationType: 'RequestResponse', // Synchronous invocation
//         Payload: JSON.stringify({}) // Pass any required input payload
//     };
//     await dbConnectAndExecute(mongoString);
//     try {
//         const user = await UserModel.find({ _id: event.id });
//         const response = await lambda.invoke(params).promise();
//         console.log("Response: ", response);
//         const responsePayload = JSON.parse(response.Payload);
//         console.log("Response Payload: ", responsePayload);
//         return {
//             statusCode: 200,
//             body: responsePayload
//         }
//     }
//     catch (e) {
//         return {
//             statusCode: 500,
//             body: "Something Went Wrong"
//         }
//     }

// });

exports.handler = async (event, context) => {
    const lambda = new AWS.Lambda();
    const params = {
        FunctionName: 'hello_world', // Replace with the name of the target Lambda function
        InvocationType: 'RequestResponse', // Synchronous invocation
        Payload: JSON.stringify({id: "62a79344e8f950d28f474689"}) // Pass any required input payload
    };
    try {
        const res = await lambda.invoke(params).promise();
        console.log("Response: ", res);
        const response = JSON.parse(res.Payload);
        console.log("Response Payload: ", response);
        return response;
    }
    catch (e) {
        return {
            statusCode: 500,
            body: e
        }
    }
}
