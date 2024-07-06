"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restoranController_1 = require("../controllers/restoranController");
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const restoran_1 = __importDefault(require("../models/restoran"));
const sto_1 = __importDefault(require("../models/sto"));
const radnoVremeRestorana_1 = __importDefault(require("../models/radnoVremeRestorana"));
const path = require('path');
const restoranRouter = express_1.default.Router();
const restoranController = new restoranController_1.RestoranController();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
restoranRouter.route("/getNumberOfRestoran").get((req, res) => restoranController.getNumberOfRestoran(req, res));
restoranRouter.route("/getReservationsLast24Hours").get((req, res) => restoranController.getReservationsLast24Hours(req, res));
restoranRouter.route("/getReservationsLast7Days").get((req, res) => restoranController.getReservationsLast7Days(req, res));
restoranRouter.route("/getReservationsLastMonth").get((req, res) => restoranController.getReservationsLastMonth(req, res));
restoranRouter.route("/getAllRestorani").get((req, res) => restoranController.getAllRestorani(req, res));
restoranRouter.route("/getAllRestoraniWithRatings").get((req, res) => restoranController.getAllRestoraniWithRatings(req, res));
restoranRouter.route("/getRestoranWithNaziv").post((req, res) => restoranController.getRestoranWithNaziv(req, res));
restoranRouter.route("/getRecenzijeForRestoran").post((req, res) => restoranController.getRecenzijeForRestoran(req, res));
restoranRouter.route("/kreirajRezervaciju").post((req, res) => restoranController.kreirajRezervaciju(req, res));
restoranRouter.route("/getJelaForRestoran").post((req, res) => restoranController.getJelaForRestoran(req, res));
restoranRouter.route("/getSlikaJelo").post((req, res) => restoranController.getSlikaJelo(req, res));
restoranRouter.route("/getLayoutForRestoran").post((req, res) => restoranController.getLayoutForRestoran(req, res));
restoranRouter.post('/upload-layout', upload.single('layout'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path.join(__dirname, "../../", req.file.path);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const restoranData = data.restoran;
        let pocetak = req.body.pocetakRadnogVremena;
        let kraj = req.body.krajRadnogVremena;
        let radnoVreme = new radnoVremeRestorana_1.default({
            restoran: req.body.naziv,
            pocetak: pocetak,
            kraj: kraj
        });
        yield radnoVreme.save();
        let restoran = new restoran_1.default({
            naziv: req.body.naziv,
            adresa: req.body.adresa,
            tip: req.body.tip,
            telefon: req.body.telefon,
            opis: req.body.opis,
            kitchen: restoranData.kitchen,
            toilets: restoranData.toilets
        });
        yield restoran.save();
        const stolovi = yield sto_1.default.find({});
        let nextId = 0;
        stolovi.forEach(sto => {
            if (sto.id > nextId) {
                nextId = sto.id;
            }
        });
        nextId = nextId + 1;
        const tablePromises = data.tables.map(table => {
            return new sto_1.default(Object.assign(Object.assign({}, table), { restoran: req.body.naziv, id: nextId++ })).save();
        });
        yield Promise.all(tablePromises);
        res.json("Uspesno dodat restoran");
    }
    catch (error) {
        console.error('Desila se greska');
        res.json("Desila se greska");
    }
    finally {
        fs.unlinkSync(filePath);
    }
}));
exports.default = restoranRouter;
