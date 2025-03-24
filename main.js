// Get the client
const mysql = require('mysql2');
const express = require('express')
const app = express()
const port = 3000
let lost_dogs = []

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd1234',
    database: 'dog',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

// A simple SELECT query
connection.query(
    'SELECT name, date_missing FROM dogs WHERE status="missing"',
    function (err, results) {
        lost_dogs = results
        console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
    }
);

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Lost Dog World </h1><p>We help reunite you with your best friend.</p>',)
})

app.get('/dashboard', (req, res) => {
    connection.query(
        'SELECT name, date_missing FROM dogs WHERE status="missing"',
        function (err, results) {
            if (err) {
                console.error(err);
                res.status(500).send("Error retrieving lost dogs.");
                return;
            }

            let title = '<h1>Most Wanted Pooches</h1>';
            let table_start = '<table border="1"><tr><th>Name</th><th>Date Missing</th></tr>';
            let table_end = '</table>';
            let table_rows = results.map(dog =>
                `<tr><td>${dog.name}</td><td>${new Date(dog.date_missing).toLocaleDateString()}</td></tr>`
            ).join('');

            let display_html = title + table_start + table_rows + table_end;
            res.send(display_html);
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
