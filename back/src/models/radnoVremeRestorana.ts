import mongoose from "mongoose";

const Schema = mongoose.Schema;

let RadnoVremeRestorana = new Schema({
    restoran:{
        type: String
    },
    pocetak:{
        type: String
    },
    kraj:{
        type: String
    }
});

export default mongoose.model("RadnoVremeRestorana", RadnoVremeRestorana, "radnoVremeRestorana");