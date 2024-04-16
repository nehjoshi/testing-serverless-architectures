const failureLambda = require('failure-lambda');
const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');
const UserModel = require('./model/User.js');

const ssm = new AWS.SSM();

async function dbConnectAndExecute(dbUrl) { //Establish connection with DB
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


async function getParameterValue(parameterName) { //Get SSM Parameter values
    try {
        const response = await ssm.getParameter({ Name: parameterName }).promise();
        return response.Parameter.Value;
    } catch (error) {
        console.error('Error retrieving parameter:', error);
        throw error;
    }
}

exports.handler = failureLambda(async (event, context, callback) => {
    const failureLambdaParam = process.env.FAILURE_INJECTION_PARAM;
    const parameterValue = await getParameterValue(failureLambdaParam);
    // Access the id parameter
    console.log(event.id);
    await dbConnectAndExecute(process.env.DB_URL);
    try {
        const user = await User.findOneAndUpdate({ _id: event.id }, { email: event.newEmail }); //Find and update user's email
        await user.save();
        return {
            statusCode: 200,
            user: user
        }
    }
    catch (e) {
        return {
            statusCode: 500,
            message: "Internal Server Error"
        }
    }
})