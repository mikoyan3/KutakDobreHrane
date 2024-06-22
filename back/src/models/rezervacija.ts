import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Rezervacija = new Schema({
    datum:{
        type: String
    },
    sto: {
        type: Number
    },
    gost: {
        type: String
    },
    opis: {
        type: String
    },
    status: {
        type: String
    },
    komentarKonobara: {
        type: String
    },
    brojGostiju: {
        type: Number
    },
    id: {
        type: Number
    }
});

export default mongoose.model("rezervacija", Rezervacija, "rezervacija");