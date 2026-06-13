const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
         type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email Address: "+value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter a Strong password");
            }
        } 
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        required: true,
        validate(value) {
            if(!["male","female","others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        } 
    },
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: "+value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String],
    },
},{
    timestamps: true,
});

const User = mongoose.model("User",userSchema);

module.exports = User;

