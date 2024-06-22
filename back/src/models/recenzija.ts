import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Recenzija = new Schema({
    restoran:{
        type: String
    },
    rezervacijaId:{
        type: Number
    }, 
    ocena: {
        type: Number
    }, 
    komentar: {
        type: String
    }
});

export default mongoose.model("Recenzija", Recenzija, "recenzija");