// ---------------------------------* Import Modules and start Server *-------------------------------------
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ExpressJs and MongoDb Initializing Code
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 8000;
app.listen(port, () => console.log(`CodeHub Server listening at http://localhost:${port} ...`));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
mongoose.connect("mongodb://127.0.0.1:27017/codehub", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log("MongoDB Database Conncted ...");
});

// ---------------------------------------------------------------------------------------------------------
// --------------------------------------------* User Schema *----------------------------------------------
// ------------------------------------------* SignUp / Login *---------------------------------------------

const userSchema = new mongoose.Schema({                                            // User Schema
    email : String,
    password : String,
    projects : Object
});

const userModel = new mongoose.model('Users', userSchema);                          // User Model

// Creating User
app.post('/signup', async (req, res)=>{                                             // Rounte for Creating User
    let userObj = new userModel(req.body);
    let users = await userModel.findOne({email : userObj.email, password : userObj.password},(err, user)=>{ console.log({error : err}); });
    if (users != null) {
        res.send({
            message : "User already Exists",
            userData : users
        });
    }
    else {
        userObj.save().then( async ()=>{
            let users = await userModel.findOne({email : userObj.email, password : userObj.password},(err, user)=>{ console.log({error : err}); });
            if (users != null) {
                res.send({
                    message : "User Created",
                    userData : users
                });
            }
        }).catch((error) => {
            res.send(error.message)
        })
    }

});

// Getting User Info
app.get('/user-email=:email&password=:password', async (req, res)=>{                // Route for Getting User Info
    const userParams = req.params
    let users = await userModel.findOne(userParams,(err, user)=>{ console.log({error : err}); });
    if (users != null) {
        res.send(users);
    }
    else {
        res.send("User Not Found")
    }
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------* Create Project Schema *-----------------------------------------

const projectSchema = new mongoose.Schema({                                         // Project Schema
    project_name : String,
    project_files : Array,
    project_created_on : String,
    project_created_by : String,
    project_contributors : Array
});

const projectModel = new mongoose.model("projects", projectSchema);                 // Project Model

app.post('/CreateProject', async (req, res) => {                                          // Route for Creating Project
    let creator = await userModel.findOne({email : req.body.project_created_by}, (err, user)=>{ console.log({error : err});});
    console.log(creator)
    const data = {
        project_name : req.body.project_name,
        project_created_on : req.body.project_created_on,
        project_created_by : creator,
        project_contributors : [creator]
    }
    console.log(data);
    if (creator != null){
    let projData = new projectModel(data);
        projData.save().then(()=>{
            res.send({message : "Project Created successfully !!!"});
        }).catch(err=>{res.send(err)});
    }
    else {
        res.send({message : "Creator Not Found !!!"});
    }
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------* Add Files to Project *------------------------------------------

const fileSchema = new mongoose.Schema({                                            // file Schema
    file_name : String,
    file_content : String,
    file_created_on : String,
    file_created_by : String,
    project_name : String
});

const fileModel = new mongoose.model("files", fileSchema);                          // file Model

app.post('/AddFile', async (req, res) => {
    let fileRecived = new fileModel(req.body);
    let nowProject = projectModel.findOne({project_name : req.body.project_name}, (err, project) =>{console.log(err)});
    let filesArray = nowProject.project_files
    if (filesArray.length === 0){
        filesArray = [fileRecived];
    }
    else {
        filesArray.push(fileRecived);
    }
    let fileProject = projectModel.findOneAndUpdate({project_name : fileRecived.project_name},
                                                    {project_files : filesArray});
    if (fileProject != null) {
        fileProject.project_files.push(fileRecived);        
    }
    else{
        res.send("Project Not Found");
    }
});



// ---------------------------------------------------------------------------------------------------------
// -------------------------------------* Create Contact Form Schema *--------------------------------------

const contactFormSchema = new mongoose.Schema({                                     // Contact Form Schema
    name : String,
    email : String,
    message : String
});
const contactFormModel = new mongoose.model("Contact Form", contactFormSchema);     // Contact Form Model

app.post('/ContactForm', (req, res) => {                                            // Route to submit Contact Form
    const ddata = req.body
    let formData = new contactFormModel(ddata);
    formData.save().then(()=>{
        res.send("Data Saved Successfully !!!");
    }).catch((error)=>{
        res.send(`Error Occured !!! => ${error}`);
        console.log(error)
    });
});

// ---------------------------------------------------------------------------------------------------------