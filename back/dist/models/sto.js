"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Sto = new Schema({
    id: {
        type: Number
    },
    restoran: {
        type: String
    },
    brojMesta: {
        type: Number
    },
    x: {
        type: Number
    },
    y: {
        type: Number
    }
});
exports.default = mongoose_1.default.model("Sto", Sto, "sto");
