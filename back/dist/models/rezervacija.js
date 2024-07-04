"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Rezervacija = new Schema({
    datum: {
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
    konobar: {
        type: String
    },
    brojGostiju: {
        type: Number
    },
    id: {
        type: Number
    },
    restoran: {
        type: String
    }
});
exports.default = mongoose_1.default.model("rezervacija", Rezervacija, "rezervacija");
