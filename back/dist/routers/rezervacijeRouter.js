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
rezervacijeRouter.route("/getNeobradjeneRezervacije").post((req, res) => rezervacijeController.getNeobradjeneRezervacije(req, res));
rezervacijeRouter.route("/getRezervacija").post((req, res) => rezervacijeController.getRezervacija(req, res));
rezervacijeRouter.route("/potvrdiRezervaciju").post((req, res) => rezervacijeController.potvrdiRezervaciju(req, res));
rezervacijeRouter.route("/odbijRezervaciju").post((req, res) => rezervacijeController.odbijRezervaciju(req, res));
rezervacijeRouter.route("/getRezervacijeZaPotvrdu").post((req, res) => rezervacijeController.getRezervacijeZaPotvrdu(req, res));
rezervacijeRouter.route("/potvrdiDolazak").post((req, res) => rezervacijeController.potvrdiDolazak(req, res));
rezervacijeRouter.route("/odbijDolazak").post((req, res) => rezervacijeController.odbijDolazak(req, res));
exports.default = rezervacijeRouter;
