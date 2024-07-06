"use strict";
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
exports.RezervacijeController = void 0;
const restoran_1 = __importDefault(require("../models/restoran"));
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
const recenzija_1 = __importDefault(require("../models/recenzija"));
const sto_1 = __importDefault(require("../models/sto"));
const bcrypt = require('bcrypt');
class RezervacijeController {
    constructor() {
        this.getAktuelneRezervacije = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let gost = req.body.gost;
                let trenutniDatum = new Date();
                trenutniDatum.setHours(trenutniDatum.getHours() + 2);
                let rezervacije = yield rezervacija_1.default.find({ gost: gost, status: "potvrdjena" });
                let buduceRezervacije = [];
                rezervacije.forEach(rez => {
                    let datumRez = new Date(rez.datum);
                    if (datumRez >= trenutniDatum) {
                        buduceRezervacije.push(rez);
                    }
                });
                let restorani = yield restoran_1.default.find({});
                if (buduceRezervacije.length == 0) {
                    res.json({ message: 'Nema aktuelnih rezervacija', rezervacije: [], restorani: [] });
                }
                else {
                    res.json({ message: 'Aktuelne rezervacije postoje', rezervacije: buduceRezervacije, restorani: restorani });
                }
            }
            catch (err) {
                console.log(err);
            }
        });
        this.getArhiviraneRezervacije = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let gost = req.body.gost;
                let trenutniDatum = new Date();
                trenutniDatum.setHours(trenutniDatum.getHours() + 2);
                let rezervacije = yield rezervacija_1.default.find({ gost: gost, status: { $nin: ["naCekanju", "potvrdjena"] } });
                let arhiviraneRez = [];
                rezervacije.forEach(rez => {
                    let datumRez = new Date(rez.datum);
                    if (datumRez < trenutniDatum) {
                        arhiviraneRez.push(rez);
                    }
                });
                let recenzije = yield recenzija_1.default.find({});
                let matchingRecenzije = [];
                recenzije.forEach(rec => {
                    arhiviraneRez.forEach(rez => {
                        if (rec.rezervacijaId == rez.id) {
                            matchingRecenzije.push(rec);
                        }
                    });
                });
                let stolovi = yield sto_1.default.find({});
                if (arhiviraneRez.length == 0) {
                    res.json({ message: "Nema arhiviranih rezervacija!", rezervacije: [], recenzije: [], stolovi: [] });
                }
                else {
                    res.json({ message: "Arhivirane rezervacije postoje!", rezervacije: arhiviraneRez, recenzije: matchingRecenzije, stolovi: stolovi });
                }
            }
            catch (err) {
                console.log(err);
            }
        });
        this.otkaziRezervaciju = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let id = req.body.id;
            let rezervacija = yield rezervacija_1.default.deleteOne({ id: id });
            res.json("Uspesno obrisana rezervacija!");
        });
        this.ostaviRecenziju = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let id = req.body.id;
            let komentar = req.body.komentar;
            let ocena = req.body.ocena;
            let restoran = req.body.restoran;
            let rezervacija = yield rezervacija_1.default.findOne({ id: id });
            if (rezervacija) {
                const newRecenzija = new recenzija_1.default({
                    restoran: restoran,
                    rezervacijaId: id,
                    ocena: ocena,
                    komentar: komentar
                });
                yield newRecenzija.save();
                res.json("Uspesno ste ostavili recenziju!");
            }
            else {
                res.json("Vec postoji recenzija za datu rezervaciju!");
            }
        });
        this.getNeobradjeneRezervacije = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let rezervacije = yield rezervacija_1.default.find({ restoran: req.body.restoran, status: 'naCekanju' });
                let rezervacijeUBuducnosti = [];
                let trenutniDatum = new Date();
                trenutniDatum.setHours(trenutniDatum.getHours() + 2);
                for (let rez of rezervacije) {
                    let datumRez = new Date(rez.datum);
                    if (!(datumRez < trenutniDatum)) {
                        rezervacijeUBuducnosti.push(rez);
                    }
                    else {
                        rez.status = "odbijena";
                        yield rez.save();
                    }
                }
                res.json(rezervacijeUBuducnosti);
            }
            catch (err) {
                console.log(err);
            }
        });
        this.getRezervacija = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.body.id;
                let rezervacija = yield rezervacija_1.default.findOne({ id: id });
                res.json(rezervacija);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.potvrdiRezervaciju = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let rezId = req.body.rezId;
                let sto = req.body.sto;
                let konobar = req.body.konobar;
                let rezervacija = yield rezervacija_1.default.findOne({ id: rezId });
                rezervacija.sto = sto;
                rezervacija.status = "potvrdjena";
                rezervacija.konobar = konobar;
                yield rezervacija.save();
                res.json("Uspesno ste potvrdili rezervaciju!");
            }
            catch (error) {
                console.log(error);
            }
        });
        this.odbijRezervaciju = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let komentar = req.body.komentar;
                let rezId = req.body.rezId;
                let kon = req.body.konobar;
                let rezervacija = yield rezervacija_1.default.findOne({ id: rezId });
                rezervacija.komentarKonobara = komentar;
                rezervacija.status = "odbijena";
                rezervacija.konobar = kon;
                yield rezervacija.save();
                res.json("Uspesno ste odbili rezervaciju!");
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getRezervacijeZaPotvrdu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let konobar = req.body.konobar;
                let trenutniDatum = new Date();
                trenutniDatum.setHours(trenutniDatum.getHours() + 2);
                trenutniDatum.setMinutes(trenutniDatum.getMinutes() - 30);
                let rezervacije = yield rezervacija_1.default.find({ konobar: konobar, status: 'potvrdjena' });
                let rezervacijeZaPotvrdu = [];
                rezervacije.forEach(rez => {
                    let datum = new Date(rez.datum);
                    datum.setHours(datum.getHours() + 3);
                    if (datum <= trenutniDatum) {
                        rezervacijeZaPotvrdu.push(rez);
                    }
                });
                res.json(rezervacijeZaPotvrdu);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.potvrdiDolazak = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let rezId = req.body.rezId;
                let rezervacija = yield rezervacija_1.default.findOne({ id: rezId });
                rezervacija.status = "ostvarena";
                yield rezervacija.save();
                res.json("Uspeh!");
            }
            catch (error) {
                console.log(error);
            }
        });
        this.odbijDolazak = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let rezId = req.body.rezId;
                let rezervacija = yield rezervacija_1.default.findOne({ id: rezId });
                rezervacija.status = "neostvarena";
                yield rezervacija.save();
                res.json("Uspeh!");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.RezervacijeController = RezervacijeController;
