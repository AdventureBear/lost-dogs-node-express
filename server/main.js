// Get the client
const mysql = require('mysql2');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())


// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded()



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
    res.send('<h1>Welcome to Lost Dog World </h1><p>We help reunite you with your best friend.</p>' +
        '<br /><a href="http://localhost:3000/dogs">Search all dogs</a>' )
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
            // res.json(results)
        }
    );
});

// 'SELECT * from dogs'
// app.get('/name of route here ')
// app.post
// app.update
// app.delete

// CRUD each table
//
// /dogs
// -adding a new dog
// -showing all the dogs
//
// /dogs/:id
// -showing a single dog
// -update an dog
// -delete an dog



//Get all dogs
app.get('/dogs', (req,res) =>{
 connection.query('SELECT * from dogs', (err,results) => {

     res.json(results)

 })

})




//create a new dog
app.post('/dogs', jsonParser, (req, res) => {
    const {name, date_missing, breed, status, date_found, sex} = req.body

connection.query(`INSERT INTO dogs (name, date_missing, breed, status, sex) VALUES ('${name}', '${date_missing}', '${breed}', '${status}', '${sex}')`,
    (err, results) => {
        res.json(results)
    }
    );
    // console.log("Request Body: ", req.body)
    // res.json(req.body.name)
})

//Get a dog
app.get('/dogs/:id', (req, res) =>{
    console.log(req.params.id)
    const dogId = req.params.id
    connection.query('SELECT * from dogs WHERE id=' + dogId, (err,results)=>{
        res.json(results)
    })
    // result.send(`Show this dog: ${request.params.id}`)
})

//Update a dog
app.patch('/dogs/:id', (req, res) =>{
    const dogId = req.params.id
    const {name, date_missing, breed, status, date_found, sex} = req.body
    // UPDATE t1 SET col1 = col1 + 1 WHERE id = ;

    connection.query(`UPDATE dogs SET name="${name}" WHERE id=${dogId}`, (err,results)=>{
        console.log(`Updating NAME for dog , ${dogId}`)
        if(err){ console.log(err)}

        res.json(results)
    })


})

//delete a dog
app.delete('/dogs/:id', (req,res)=>{
    const dogId = req.params.id
    connection.query(`DELETE from dogs WHERE id=${dogId}`, (err,results)=>{
        console.log("Deleteing dog", dogId)
        res.json(results)
    })

    // res.send(`Delete this dog: ${req.params.id}`)
})



app.listen(port, () => {
    console.log(`Lost dog app listening on port ${port}`)
})


