import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Gost = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    securityQuestion: {
        type: String
    },
    securityAnswer: {
        type: String
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    gender: {
        type: String
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    pictureUrl: {
        type: String
    },
    creditCardNumber: {
        type: String
    },
    status: {
        type: String
    }
});

export default mongoose.model("Gost", Gost, "gost");