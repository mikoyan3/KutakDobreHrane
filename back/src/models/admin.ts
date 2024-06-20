import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Admin = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});

export default mongoose.model("Admin", Admin, "admin");