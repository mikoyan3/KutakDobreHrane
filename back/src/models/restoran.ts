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
    },
    kitchen: {
        x:{
            type: Number
        },
        y:{
            type: Number
        }
    },
    toilets: {
        x:{
            type: Number
        },
        y:{
            type: Number
        }
    }
});

export default mongoose.model("Restoran", Restoran, "restoran");