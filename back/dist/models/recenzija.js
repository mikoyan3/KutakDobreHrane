"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Recenzija = new Schema({
    restoran: {
        type: String
    },
    rezervacijaId: {
        type: Number
    },
    ocena: {
        type: Number
    },
    komentar: {
        type: String
    }
});
exports.default = mongoose_1.default.model("Recenzija", Recenzija, "recenzija");
