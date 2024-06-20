"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Konobar = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    securityQuestion: {
        type: String
    },
    securityAnswer: {
        type: String
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    gender: {
        type: String
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    pictureUrl: {
        type: String
    },
    restoran: {
        type: String
    }
});
exports.default = mongoose_1.default.model("Konobar", Konobar, "konobar");
