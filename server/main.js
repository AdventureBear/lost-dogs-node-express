// Get the client
const mysql = require('mysql2');
const express = require('express')
const app = express()


//constants
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

// app.get('/dashboard', (req, res) => {
//     connection.query(
//         'SELECT name, date_missing FROM dogs WHERE status="missing"',
//         function (err, results) {
//             if (err) {
//                 console.error(err);
//                 res.status(500).send("Error retrieving lost dogs.");
//                 return;
//             }
//
//             let title = '<h1>Most Wanted Pooches</h1>';
//             let table_start = '<table border="1"><tr><th>Name</th><th>Date Missing</th></tr>';
//             let table_end = '</table>';
//             let table_rows = results.map(dog =>
//                 `<tr><td>${dog.name}</td><td>${new Date(dog.date_missing).toLocaleDateString()}</td></tr>`
//             ).join('');
//
//             let display_html = title + table_start + table_rows + table_end;
//             // res.send(display_html);
//             res.json(results)
//         }
//     );
// });

// app.get('/name of route here ')
// app.post
// app.update
// app.delete

// CRUD each table
//
// /owners
// -adding a new owner
// -showing all the owners
//
// /owners/:id
// -showing a single owner
// -update an owenr
// -delete an owner


// POST/GET/UPDATE or  DELETE
// ROUTE
//Get all dogs
app.get('/dogs', (req,res) =>{
    res.send("Show all dogs")
})

//create a new dog
app.post('/dogs', (req, res) => {
    res.send("add a new dog")
})

//Get a dog
app.get('/dogs/:id', (request, result) =>{
    console.log(request.params.id)
    //query for dog id =  id
    result.send(`Show this dog: ${request.params.id}`)
})

//Update a dog
app.patch('/dogs/:id', (req, res) =>{
    res.send(`updating this dog ${req.params.id} `)
})

//delete a dog
app.delete('/dogs/:id', (req,res)=>{
    res.send(`Delete this dog: ${req.params.id}`)
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


