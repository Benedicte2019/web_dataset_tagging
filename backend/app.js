const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser')

const { spawn } = require("child_process");



const path = require("path");

// var jsonParser = bodyParser.json()

const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileExtLimiter = require("./middleware/fileExtLimiter")
const fileSizeLimiter = require("./middleware/fileSizeLimiter")

const PORT = process.env.PORT || 3500;

const app = express();

// configure the app to use bodyParser()
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());
app.use(express.json());

const executePython = async (script, args) => {
    const arguments = args.map(arg => arg.toString());

    const py = spawn("python", [script, ...arguments]);

    const result = await new Promise((resolve, reject) => {
        let output;

        py.stdout.on('data', (data) => {
            output = JSON.parse(data);
        });

        py.stderr.on('data', (data) => {
            console.error(`[python] Error occured: ${data}`)
            reject(`Error occured in ${script}`);
        });

        py.on("exit", (code) => {
            console.log(`Child process exited with code ${code}`);
            resolve(output);
        });
    });

    return result
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/main.html"));
});

app.get("/main.css", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/main.css"));
});

app.post('/upload', 
    fileUpload({createParentPath: true}),
    filesPayloadExists,
    fileExtLimiter(['.csv','.xlsx']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files)


        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({status: "error", message: err})
                filepaths = filepath
            })
        })
        const filepath = path.join(__dirname, 'files', Object.keys(files)[0])

        return res.json({ status:'Succesfully uploaded', message: filepath })
    }

)

app.post('/generate',
    async (req, res) => {
        console.log(req.body)
        try {
            const result = await executePython("python/gen_description.py", [req.body.name])
            return res.json({result: result})
        } catch (error) {
            return res.status(500).json({error: error});
        }

    }
)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))