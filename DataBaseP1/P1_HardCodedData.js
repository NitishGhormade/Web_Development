const express = require("express");
const usersData = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();


// Middleware :- 
app.use(express.urlencoded({extended: false}))

app.use((req, res, next) => {
    fs.appendFile("./log_data.txt", `${Date.now()}  ${req.method}   ${req.path}\n`, (err) => {
        next();
    })
})


// Routes 
app.get("/users", (req, res) => {
    const html = `
    <ul>
    ${usersData.map((val) => `<li>${val.first_name}</li>`).join("")}
    </ul>
    `;
    return res.send(html);
})

app.get("/api/users", (req, res) => {
    return res.json(usersData);
})

app.get("/api/users/:userId", (req, res) => {
    const uid = Number(req.params.userId);         // userId is a String and we have to retrieve it as a Number
    const user = usersData.find((val) => val.id == uid);

    if(!user){
        return res.status(404).json({"error": "User NOT Found"}) 
    }
    return res.json(user);
})

app.post("/api/users", (req, res) => {
    const body = req.body;

    if(!body || !body.first_name || !body.last_name || !body.gender){
        return res.status(400).json({"error": "Provide FULL information"})
    }

    usersData.push({"id": usersData.length + 1, ...body});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(usersData), (err) => {
        return res.json({"status": `user with ID ${usersData.length} is created`})
    })
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