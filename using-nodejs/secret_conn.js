// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/

// Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "", // your secret region
    secretName = "", // your secret name
    secret,
    decodedBinarySecret;

const dotenv = require('dotenv');
dotenv.config();
 
// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region,
    secretAccessKey: process.env.SECRET_ACCESS_KEY, // add your access keys in env file
    accessKeyId: process.env.ACCESS_KEY_ID // add your access keys in env file
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        console.log(err)
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            console.log(data)
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            console.log(decodedBinarySecret)
            decodedBinarySecret = buff.toString('ascii');
        }
    }

    // Your code goes here. 
    
    //Parsing secret JSON object
    const secretJSON = JSON.parse(secret);
    const { Pool } = require('pg')
    //Pass connection info to db
    //As we are using Postgres DB, 'pg' module is used, in case of MYSQL, you can connect in similar way by using 'mysql' module
    const pool = new Pool({
        user: secretJSON.username,
        host: secretJSON.host,
        database: secretJSON.dbname,
        password: secretJSON.password,
        port: 5432,
    })
    //Query the table, Replace table name with your table name
    pool.query('SELECT * from user_login limit 1', (err, res) => {
        console.log(res.rows) 
        pool.end() 
    })
});