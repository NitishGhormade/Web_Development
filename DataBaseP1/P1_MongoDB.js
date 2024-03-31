const express = require("express");
const mongoose = require("mongoose")

const app = express();

// Connection 
mongoose
    .connect("mongodb://127.0.0.1:27017/Project1-Users")
    .then(() => console.log("MongoDB Connected!"))
    .catch((err) => console.log("MongoDB Error", err))

// Schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    gender: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// Model
const User = mongoose.model("user", userSchema)


// Middleware :- 
app.use(express.urlencoded({extended: false}))


// Routes 
app.get("/users", async (req, res) => {
    const allUsers = await User.find();  // To get all Users from the Collection 

    const html = `
    <ul>
    ${allUsers.map((val) => `<li>${val.first_name} - ${val.email}</li>`).join("")}
    </ul>
    `;
    return res.send(html);
})

app.get("/api/users", async (req, res) => {
    const allUsers = await User.find();

    return res.json(allUsers);
})

app.get("/api/users/:userId", (req, res) => {
    const uid = Number(req.params.userId);         // userId is a String and we have to retrieve it as a Number
    const user = usersData.find((val) => val.id == uid);

    if(!user){
        return res.status(404).json({"error": "User NOT Found"}) 
    }
    return res.json(user);
})

app.post("/api/users", async (req, res) => {
    const body = req.body;

    if(!body || !body.first_name || !body.last_name || !body.gender){
        return res.status(400).json({"error": "Provide FULL information"})
    }

    const userObj = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        gender: body.gender,
        email: body.email
    })

    return res.status(200).json({"status": "User Created Successfull"})
})

app.patch("/api/users/:userId", (req, res) => {
    const uid = Number(req.params.userId);
    const uidIDX = uid - 1;
    usersData[uidIDX] = {...usersData[uidIDX], ...(req.body)}
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(usersData), (err) => {
        return res.json({"status": `User with ID ${uid} is Updated`})
    })
})

app.delete("/api/users/:userId", (req, res) => {
    const uid = Number(req.params.userId);

    if(uid > usersData.length){
        return res.json({"status": "Enter Valid User ID"})
    }

    usersData.splice(uid - 1, 1)
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(usersData), (err) => {
        return res.json({"status": `User of ID ${uid} id Deleted`});
    })
})

// Server Start
app.listen(8080, () => console.log("Server Started! "));