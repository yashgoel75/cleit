import mongoose from "mongoose";
const { Schema } = mongoose;

const team = new Schema({
    name: String,
    designation: String,
    mobile: Number,
    email: String
})
const social = new Schema({
    name: String,
    handle: String
})
const society = new Schema ({
    name: String,
    username: String,
    email: String,
    password: String,
    about: String,
    team: [team],
    social: [social]
})