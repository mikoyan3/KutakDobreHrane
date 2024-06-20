import mongoose from "mongoose";

const Schema = mongoose.Schema;

let DeoNarudzbine = new Schema({
    jelo: {
        type: Number
    },
    kolicina: {
        type: Number
    }, 
    cena: {
        type: Number
    }
});

export default mongoose.model("DeoNarudzbine", DeoNarudzbine, "deoNarudzbine");