import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ExpressJs and MongoDb Initializing Code
const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({                                     // Contact Form Schema
    name: String,
    email: String,
    subject: String,
    message: String
});
const contactFormModel = new mongoose.model("Contact Form", contactFormSchema);     // Contact Form Model

export default  contactFormModel;