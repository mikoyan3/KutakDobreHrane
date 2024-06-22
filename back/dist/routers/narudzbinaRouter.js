"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const narudzbinaController_1 = require("../controllers/narudzbinaController");
const narudzbinaRouter = express_1.default.Router();
const narudzbinaController = new narudzbinaController_1.NarudzbinaController();
narudzbinaRouter.route("/generisiNovuNarudzbinu").post((req, res) => narudzbinaController.generisiNovuNarudzbinu(req, res));
exports.default = narudzbinaRouter;
