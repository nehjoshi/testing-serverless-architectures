const AWS = require('aws-sdk');

const statusMessages = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    408: "Request Timeout",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable"
};

const getParams = (functionName, payload) => {
    return {
        FunctionName: functionName,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(payload)
    }
}

exports.handler = async (event, context) => {
    const lambda = new AWS.Lambda();
    const helloWorldParams = getParams("hello_world", { id: event.id });
    const backupDBParams = getParams("backupDB", { id: event.id });
    console.log(helloWorldParams);

    let res = await lambda.invoke(helloWorldParams).promise();
    let response = JSON.parse(res.Payload);
    let n = 1;
    while (!response.user && n <= 3) { //Mechanism to retry function call 3 times
        res = await lambda.invoke(helloWorldParams).promise();
        response = JSON.parse(res.Payload);
        console.log("Current iteration: ", n);
        n += 1;
    }

    if (!response.user) return {status: 500, message: "Internal server error"}
    console.log("Final response: ", response);
    return response;



    // const res = await lambda.invoke(helloWorldParams).promise(); //If A doesn't work, try B
    // const response = JSON.parse(res.Payload);
    // if (!response.user) {
    //     const res2 = await lambda.invoke(backupDBParams).promise();
    //     const response2 = JSON.parse(res2.Payload);
    //     console.log("Backup function response: ", response2);
    //     return response2;
    // }
    // else {
    //     console.log("Original function response: ", response);
    //     return response;
    // }
    

    try {
        console.log("Invoking hello_world...");
        const res = await lambda.invoke(params).promise(); //Invoke first function to get the user
        const response = await JSON.parse(res.Payload);
        console.log("Response from hello_world: ", response);



        if (response.statusCode && Number(response.statusCode) !== 200) return {
            statusCode: response.statusCode,
            message: statusMessages[Number(response.statusCode)]
        }

        if (!response.user) return {
            statusCode: 500,
            message: "Internal Server Error, please try again"
        };





        // const updateParams = {
        //     FunctionName: 'db_updates', // Replace with the name of the target Lambda function
        //     InvocationType: 'RequestResponse', // Synchronous invocation
        //     Payload: JSON.stringify({ id: response.user[0]._id, newEmail: event.newEmail }) // Pass any required input payload
        // };
        // console.log("Invoking db_updates... ", updateParams);

        // const resUpdate = await lambda.invoke(updateParams).promise(); //Invoke second function to update user's email
        // const responseUpdate = JSON.parse(resUpdate.Payload);
        // console.log("Response from db_updates: ", responseUpdate);
        // return responseUpdate;
    }
    catch (e) {
        return {
            statusCode: 500,
            body: e
        }
    }
}
