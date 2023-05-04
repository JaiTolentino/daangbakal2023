const express = require('express'); //node js frameworl
const app = express(); // creating the express app
const async = require('hbs/lib/async'); // used in for waiting lines of code to be finished
const session = require('express-session'); // used in creating a session for login
const pagesRouter = require('./routes/pages');
const pool = require('./routes/dbconfig');
const requests = require('./routes/pagesreq');

pool.connect((error) => { // notifies the user if database connects or not
  if(error) console.log("Failed to Connect: " + error)
  else{
      console.log("Database Connected")
  }
})


app.use(express.urlencoded({extended: false})); // line 23 and 24 are codes used for connecting the front end and backend
app.use(express.json()); // this 2 lines of code is used to receive form values as JSON file

// app.use(express.static('views')) // used if we are not using handlebars. note: we are using plain HTML and CSS

// app.get("/", (req, res) => { // used to nagivate to the index.html file
//     res.sendFile(__dirname + "/views/index.html")
// })

app.use(express.static('views'));
app.set('view engine', 'hbs'); // used to display hbs or html like file in the server
app.use('/', pagesRouter);
app.use(requests);


app.listen(5000, () => { // used to start a server in my local device
    console.log("server started on port 5000")
})

