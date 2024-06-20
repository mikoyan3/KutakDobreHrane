import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Sastojak = new Schema({
    naziv: {
        type: String
    },
    jelo: {
        type: Number
    }
});

export default mongoose.model("Sastoja", Sastojak, "sastojak");