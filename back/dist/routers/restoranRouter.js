"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restoranController_1 = require("../controllers/restoranController");
const restoranRouter = express_1.default.Router();
const restoranController = new restoranController_1.RestoranController();
restoranRouter.route("/getNumberOfRestoran").get((req, res) => restoranController.getNumberOfRestoran(req, res));
restoranRouter.route("/getReservationsLast24Hours").get((req, res) => restoranController.getReservationsLast24Hours(req, res));
restoranRouter.route("/getReservationsLast7Days").get((req, res) => restoranController.getReservationsLast7Days(req, res));
restoranRouter.route("/getReservationsLastMonth").get((req, res) => restoranController.getReservationsLastMonth(req, res));
restoranRouter.route("/getAllRestorani").get((req, res) => restoranController.getAllRestorani(req, res));
restoranRouter.route("/getAllRestoraniWithRatings").get((req, res) => restoranController.getAllRestoraniWithRatings(req, res));
restoranRouter.route("/getRestoranWithNaziv").post((req, res) => restoranController.getRestoranWithNaziv(req, res));
restoranRouter.route("/getRecenzijeForRestoran").post((req, res) => restoranController.getRecenzijeForRestoran(req, res));
restoranRouter.route("/kreirajRezervaciju").post((req, res) => restoranController.kreirajRezervaciju(req, res));
exports.default = restoranRouter;
