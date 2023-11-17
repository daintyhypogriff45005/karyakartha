const express = require("express");
const dotenv = require("dotenv");
const router = require("./Router/routes");
const connection = require("./Database/Connection");
const cors = require("cors");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api",router);

connection().then(()=>{
    try {
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log("failed to connect to mongodb server");
    }
}).catch((error)=>{
    console.log("Invalid database connection with the error: "+error);
});