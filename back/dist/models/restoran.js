"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Restoran = new Schema({
    naziv: {
        type: String
    },
    adresa: {
        type: String
    },
    tip: {
        type: String
    },
    telefon: {
        type: String
    },
    opis: {
        type: String
    }
});
exports.default = mongoose_1.default.model("Restoran", Restoran, "restoran");
