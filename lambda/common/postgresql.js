const {Pool, Client} = require('pg');

const dbEndpoint = process.env.DB_ENDPOINT;

const dbHost = dbEndpoint.split(":")[0];
const dbPort = dbEndpoint.split(":")[1];
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_DATABASE;


module.exports = {
    createDBClient() {
        const client = new Client({
            host: dbHost,
            port: dbPort,
            user: dbUser,
            password: dbPassword,
            database: dbName,
        });
        return client;
    }
};