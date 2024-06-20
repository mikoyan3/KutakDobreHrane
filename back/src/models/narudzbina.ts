import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Narudzbina = new Schema({
    restoran:{
        type: String
    },
    status: {
        type: String
    },
    procenjenoVremeDostave: {
        type: Number
    },
    deoNarudzbine: {
        type: Array
    }, 
    cena: {
        type: Number
    }
});

export default mongoose.model("Narudzbina", Narudzbina, "narudzbina");