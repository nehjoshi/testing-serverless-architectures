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
        Payload: JSON.stringify({id: event.id}) // Pass any required input payload
    };
    try {
        console.log("Entered try block");
        const res = await lambda.invoke(params).promise(); //Invoke first function to get the user
        console.log("Line 2");
        const response = JSON.parse(res.Payload);
        console.log("First res: ",  response);

        const updateParams = {
            FunctionName: 'db_updates', // Replace with the name of the target Lambda function
            InvocationType: 'RequestResponse', // Synchronous invocation
            Payload: JSON.stringify({id: response.user[0]._id, newEmail: event.newEmail}) // Pass any required input payload
        };
        console.log("Line 4: Update Params: ", updateParams);

        const resUpdate = await lambda.invoke(updateParams).promise();
        console.log("Line 5");
        const responseUpdate = JSON.parse(resUpdate.Payload);
        console.log("Line 6, responseUpdate: ", responseUpdate);

        console.log("Updated User: ", responseUpdate);
        return responseUpdate;
    }
    catch (e) {
        return {
            statusCode: 500,
            body: e
        }
    }
}
