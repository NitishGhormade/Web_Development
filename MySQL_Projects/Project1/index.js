const express = require('express')
const mysql = require('mysql');
const path = require('path')

// Connecting with MySQL
const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "DaduMySQL",
	database: "Project1DB"
});

// Connect
con.connect((err) => {
	if (err) throw err;
	console.log("MySQL Connected!");
});

// Express
const app = express();

// View Engine 
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")


// Middlewares
app.use(express.urlencoded({ extended: false }))


// Routes
app.get("/", (req, res) => {
	let sql = "SELECT * FROM Project1Table_Users"

	con.query(sql, (err, result) => {
		if (err) throw err
		res.render("home", { "allResults": result })
	})
})

app.get("/signup", (req, res) => {
	res.render("signup")
})

app.post("/signup", (req, res) => {
	let sql = `INSERT INTO Project1Table_Users (username, password) VALUES ('${req.body.username}', '${req.body.password}')`

	con.query(sql, (err, result) => {
		if (err) throw err

		res.redirect("/")
	})
})

app.get("/login", (req, res) => {
	res.render("login")
})

app.post("/login", (req, res) => {
	let sql = `SELECT * FROM Project1Table_Users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`

	con.query(sql, (err, result) => {   // Result is an Array of JSON Objects
		if (err) throw err

		if (result.length == 0) {
			res.render("login", { "msg": "Login Falied" })
		}
		else {
			res.redirect("/")
		}
	})
})

app.get("/deleteUser", (req, res) => {
	let uid = req.query.id;

	let sql = `DELETE FROM Project1Table_Users WHERE id = ${uid}`;

	con.query(sql, (err, result) => {
		if(err) throw err;

		res.redirect("/")
	})
})

app.get("/updateUser", (req, res) => {
	let sql = `SELECT * FROM Project1Table_Users WHERE id = ${req.query.id}`;

	con.query(sql, (err, result) => {
		res.render("update", {User: result[0]}) // Result is Array of JSON Object
	})
})

app.post("/updateUser", (req, res) => {
	let uid = req.query.id;

	let sql = `UPDATE Project1Table_Users SET username = '${req.body.username}', password = '${req.body.password}' WHERE id = ${uid}`;

	con.query(sql, (err, result) => {
		res.redirect("/")
	})
})


// Connection
app.listen(8080, () => console.log("Server Started at PORT 8080!"))