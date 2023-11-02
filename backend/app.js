const express = require("express");
const fileUpload = require("express-fileupload")

const path = require("path");

const PORT = process.env.PORT || 3500;

const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/main.html"));
});

app.get("/main.css", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/main.css"));
});

app.post('/upload', 
    fileUpload({createParentPath: true}),
    (req, res) => {
        const files = req.files
        console.log(files)

        return res.json({status:'logged', message: 'logged'})
    }

)
app.listen(PORT, () => console .log(`Server running on port ${PORT}`))