"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
exports.default = mongoose_1.default.model("Jelo", Jelo, "jelo");
