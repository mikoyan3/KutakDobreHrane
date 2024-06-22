"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Narudzbina = new Schema({
    restoran: {
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
    datum: {
        type: String
    },
    gost: {
        type: String
    },
    deoNarudzbine: {
        type: Array
    },
    cena: {
        type: Number
    }
});
exports.default = mongoose_1.default.model("Narudzbina", Narudzbina, "narudzbina");
