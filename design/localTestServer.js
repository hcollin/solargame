
const express = require('express');

const DB = require('./functions/testDb.js');

const userFn = require('./functions/userFunctions');



const app = express();
const port = 3333;


// Initialize test data
userFn.create("user-1", "1234", "Test user 1");
userFn.create("user-2", "1234", "Test user 2");


function requestParser(req, res) {
    console.log("\nRequest", req.route);
    res.send(JSON.stringify({
        message: "testing",
    }));
}


app.get('/', requestParser);

app.listen(port, () => { console.log("Local test server started")});

