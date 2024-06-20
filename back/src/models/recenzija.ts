import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Recenzija = new Schema({
    restoran:{
        type: String
    }, 
    ocena: {
        type: Number
    }, 
    komentar: {
        type: String
    }
});

export default mongoose.model("Recenzija", Recenzija, "recenzija");