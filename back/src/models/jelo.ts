import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Jelo = new Schema({
    id: {
        type: Number
    },
    restoran: {
        type: String
    }, 
    naziv: {
        type: String
    },
    slika: {
        type: String
    }, 
    cena: {
        type: Number
    },
    sastojci: {
        type: Array
    }
});

export default mongoose.model("Jelo", Jelo, "jelo");