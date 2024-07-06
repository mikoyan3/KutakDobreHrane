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
narudzbinaRouter.route("/getNarudzbineForGost").post((req, res) => narudzbinaController.getNarudzbineForGost(req, res));
narudzbinaRouter.route("/getTrenutneNarudzbine").post((req, res) => narudzbinaController.getTrenutneNarudzbine(req, res));
narudzbinaRouter.route("/odbijNarudzbinu").post((req, res) => narudzbinaController.odbijNarudzbinu(req, res));
narudzbinaRouter.route("/potvrdiNarudzbinu").post((req, res) => narudzbinaController.potvrdiNarudzbinu(req, res));
narudzbinaRouter.route("/getJelo").post((req, res) => narudzbinaController.getJelo(req, res));
exports.default = narudzbinaRouter;
