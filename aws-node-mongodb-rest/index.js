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

    let res = await lambda.invoke(helloWorldParams).promise();
    let response = JSON.parse(res.Payload);

    if (response.statusCode) {
        return {
            status: response.statusCode,
            errorMessage: statusMessages[Number(response.statusCode)]
        }
    }

    let n = 1;
    while (!response.user && n <= 3) { //Mechanism to retry function call 3 times
        res = await lambda.invoke(helloWorldParams).promise();
        response = JSON.parse(res.Payload);
        console.log("Current iteration: ", n);
        console.log("Response for this iteration...");
        console.log(response);
        n += 1;
    }

    if (!response.user) {
        const res2 = await lambda.invoke(backupDBParams).promise(); //Switch to backup function if it doesn't work after 3 retries
        const response2 = JSON.parse(res2.Payload);
        console.log("Backup function response: ", response2);
        return response2;
    }
    else {
        console.log("Original function response: ", response);
        return response;
    }
}
