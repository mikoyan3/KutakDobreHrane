"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rezervacijeController_1 = require("../controllers/rezervacijeController");
const rezervacijeRouter = express_1.default.Router();
const rezervacijeController = new rezervacijeController_1.RezervacijeController();
rezervacijeRouter.route("/getAktuelneRezervacije").post((req, res) => rezervacijeController.getAktuelneRezervacije(req, res));
rezervacijeRouter.route("/getArhiviraneRezervacije").post((req, res) => rezervacijeController.getArhiviraneRezervacije(req, res));
rezervacijeRouter.route("/otkaziRezervaciju").post((req, res) => rezervacijeController.otkaziRezervaciju(req, res));
rezervacijeRouter.route("/ostaviRecenziju").post((req, res) => rezervacijeController.ostaviRecenziju(req, res));
exports.default = rezervacijeRouter;
