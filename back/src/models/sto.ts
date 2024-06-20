import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Sto = new Schema({
    id: {
        type: Number
    }, 
    restoran: {
        type: String
    },
    brojMesta: {
        type: Number
    }
});

export default mongoose.model("Sto", Sto, "sto");