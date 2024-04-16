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


exports.handler = async (event, context) => {
    const lambda = new AWS.Lambda();
    const params = {
        FunctionName: 'hello_world', // Replace with the name of the target Lambda function
        InvocationType: 'RequestResponse', // Synchronous invocation
        Payload: JSON.stringify({id: "62a79344e8f950d28f474689"}) // Pass any required input payload
    };
    try {
        const res = await lambda.invoke(params).promise(); //Invoke first function to get the user
        const response = JSON.parse(res.Payload);

        const updateParams = {
            FunctionName: 'db_updates', // Replace with the name of the target Lambda function
            InvocationType: 'RequestResponse', // Synchronous invocation
            Payload: JSON.stringify({id: response.user._id, newEmail: "a2@gmail.com"}) // Pass any required input payload
        };

        const resUpdate = await lambda.invoke(updateParams).promise();
        const responseUpdate = JSON.parse(resUpdate.Payload);

        console.log("Updated User: ", responseUpdate);
        return "Success";
    }
    catch (e) {
        return {
            statusCode: 500,
            body: e
        }
    }
}
