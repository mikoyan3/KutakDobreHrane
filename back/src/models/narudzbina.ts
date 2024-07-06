import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Narudzbina = new Schema({
    id:{
        type: Number
    },
    restoran:{
        type: String
    },
    status: {
        type: String
    },
    minVremeDostave: {
        type: Number
    },
    maxVremeDostave: {
        type: Number
    },
    datum:{
        type: String
    },
    gost:{
        type: String
    },
    deoNarudzbine: {
        type: Array
    }, 
    cena: {
        type: Number
    }
});

export default mongoose.model("Narudzbina", Narudzbina, "narudzbina");