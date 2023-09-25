const express = require("express");
const serverless = require("serverless-http");
const router = require("./src/router.js")
const app = express();
let PORT = 3000;

app.use("/api/v1", router)

if (isTestEnv()) {
    PORT = 3001;
}

const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV != 'test') {
        console.log(`server listening @ http://localhost:${PORT}`)
    }
});

// cleanup
process.on('SIGTERM', () => {
    console.log('Closing http server.');
    server.close((err) => {
        console.log('Http server closed.');
    });
});

// we expore explicit Express App object for JEST test.
// they don't work with serverless.Handler type.
if (isTestEnv()) {
    module.exports = app;
} else {
    module.exports = { handler: serverless(app) }
}

// checks whether this script is being executed as part of tests.
function isTestEnv() {
    return process.env.NODE_ENV == 'test'
}