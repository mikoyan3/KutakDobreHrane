import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Restoran = new Schema({
    naziv:{
        type: String
    },
    adresa: {
        type: String
    },
    tip: {
        type: String
    },
    telefon: {
        type: String
    },
    opis: {
        type: String
    }
});

export default mongoose.model("Restoran", Restoran, "restoran");