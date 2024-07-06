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
exports.RestoranController = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const restoran_1 = __importDefault(require("../models/restoran"));
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
const recenzija_1 = __importDefault(require("../models/recenzija"));
const sto_1 = __importDefault(require("../models/sto"));
const radnoVremeRestorana_1 = __importDefault(require("../models/radnoVremeRestorana"));
const jelo_1 = __importDefault(require("../models/jelo"));
const bcrypt = require('bcrypt');
class RestoranController {
    constructor() {
        this.getNumberOfRestoran = (req, res) => {
            restoran_1.default.find({}).then(rez => {
                let numberOfRestoran = rez.length;
                res.json({ count: numberOfRestoran });
            }).catch(err => {
                console.log(err);
            });
        };
        this.getReservationsCount = (timeFrame, res) => {
            let startDate;
            let endDate = new Date();
            endDate.setHours(endDate.getHours() + 2);
            switch (timeFrame) {
                case '24h':
                    startDate = new Date();
                    startDate.setHours(startDate.getHours() - 22);
                    break;
                case '7d':
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 7);
                    startDate.setHours(startDate.getHours() + 2);
                    break;
                case '1m':
                    startDate = new Date();
                    startDate.setMonth(startDate.getMonth() - 1);
                    startDate.setHours(startDate.getHours() + 2);
                    break;
                default:
                    res.json({ error: 'Invalid time frame' });
                    return;
            }
            rezervacija_1.default.find({}).then(rezultati => {
                let cnt = 0;
                rezultati.forEach(rez => {
                    let datum = new Date(rez.datum);
                    if (datum >= startDate && datum <= endDate)
                        cnt++;
                });
                res.json({ count: cnt });
            });
        };
        this.getReservationsLast24Hours = (req, res) => {
            this.getReservationsCount('24h', res);
        };
        this.getReservationsLast7Days = (req, res) => {
            this.getReservationsCount('7d', res);
        };
        this.getReservationsLastMonth = (req, res) => {
            this.getReservationsCount('1m', res);
        };
        this.getAllRestorani = (req, res) => {
            restoran_1.default.find({}).then(restorani => {
                res.json(restorani);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getAllRestoraniWithRatings = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ratings = yield recenzija_1.default.aggregate([{
                        $group: {
                            _id: "$restoran",
                            avgRating: { $avg: "$ocena" }
                        }
                    }]);
                const ratingsMap = {};
                ratings.forEach(rating => {
                    ratingsMap[rating._id] = rating.avgRating;
                });
                const restorani = yield restoran_1.default.find();
                const restoraniWithRatings = restorani.map(restoran => {
                    const restoranObject = restoran.toObject();
                    return Object.assign(Object.assign({}, restoranObject), { avgRating: ratingsMap[restoran.naziv] || 0 });
                });
                res.json(restoraniWithRatings);
            }
            catch (err) {
                console.log(err);
            }
        });
        this.getRestoranWithNaziv = (req, res) => {
            let naziv = req.body.naziv;
            restoran_1.default.findOne({ naziv: naziv }).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getRecenzijeForRestoran = (req, res) => {
            let naziv = req.body.naziv;
            recenzija_1.default.find({ restoran: naziv }).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getJelaForRestoran = (req, res) => {
            let restoran = req.body.restoran;
            jelo_1.default.find({ restoran: restoran }).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getSlikaJelo = (req, res) => {
            const directory = path.join(__dirname, "../../uploads");
            let jeloId = req.body.jeloId;
            jelo_1.default.findOne({ id: jeloId }).then(rez => {
                const filePath = path.join(directory, rez.slika);
                if (fs.existsSync(filePath)) {
                    res.type('application/octet-stream').sendFile(filePath);
                }
                else {
                    return;
                }
            }).catch(err => {
                console.log(err);
            });
        };
        this.getLayoutForRestoran = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let rezervacija = req.body.rezervacija;
                let pocetakRezervacije = new Date(rezervacija.datum);
                let donjaGranica = new Date(rezervacija.datum);
                let gornjaGranica = new Date(rezervacija.datum);
                donjaGranica.setHours(donjaGranica.getHours() - 3);
                if (donjaGranica.getHours() > pocetakRezervacije.getHours()) { //Ako odem u prethodni dan
                    donjaGranica.setDate(donjaGranica.getDate() - 1);
                }
                gornjaGranica.setHours(gornjaGranica.getHours() + 3);
                if (gornjaGranica.getHours() < pocetakRezervacije.getHours()) { //Ako odem u naredni dan
                    gornjaGranica.setDate(gornjaGranica.getDate() + 1);
                }
                let restoran = yield restoran_1.default.findOne({ naziv: rezervacija.restoran });
                let rezervacije = yield rezervacija_1.default.find({ restoran: restoran.naziv });
                let preklapajuceRezervacije = [];
                rezervacije.forEach(rez => {
                    let datumPocetka = new Date(rez.datum);
                    let datumKraja = new Date(rez.datum);
                    datumKraja.setHours(datumKraja.getHours() + 3);
                    if (!(datumPocetka >= gornjaGranica || datumKraja <= donjaGranica)) {
                        preklapajuceRezervacije.push(rez);
                    }
                });
                let stolovi = yield sto_1.default.find({ restoran: restoran.naziv });
                let zauzetiStolovi = [];
                let slobodniStolovi = [];
                let flag = false;
                stolovi.forEach(sto => {
                    preklapajuceRezervacije.forEach(rez => {
                        if (rez.status != "naCekanju") {
                            if (rez.sto == sto.id) {
                                flag = true;
                            }
                        }
                    });
                    if (flag == true) {
                        zauzetiStolovi.push(sto);
                        flag = false;
                    }
                    else {
                        slobodniStolovi.push(sto);
                    }
                });
                res.json({ restoran: restoran, zauzetiStolovi: zauzetiStolovi, slobodniStolovi: slobodniStolovi });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    kreirajRezervaciju(req, res) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let datum = req.body.datum;
            let brojOsoba = req.body.brojOsoba;
            let opis = req.body.opis;
            let restoran = req.body.restoran;
            let gost = req.body.gost;
            try {
                const pocetakRezervacije = new Date(datum);
                pocetakRezervacije.setHours(pocetakRezervacije.getHours() + 2);
                const krajRezervacije = new Date(datum);
                krajRezervacije.setHours(krajRezervacije.getHours() + 5);
                const radnoVreme = yield radnoVremeRestorana_1.default.findOne({ restoran });
                const pocetakRadnogVremena = new Date(pocetakRezervacije.getFullYear(), pocetakRezervacije.getMonth(), pocetakRezervacije.getDate(), parseInt(radnoVreme.pocetak.split(':')[0]), parseInt(radnoVreme.pocetak.split(':')[1]));
                const krajRadnogVremena = new Date(pocetakRezervacije.getFullYear(), pocetakRezervacije.getMonth(), pocetakRezervacije.getDate(), parseInt(radnoVreme.kraj.split(':')[0]), parseInt(radnoVreme.kraj.split(':')[1]));
                pocetakRadnogVremena.setHours(pocetakRadnogVremena.getHours() + 2);
                krajRadnogVremena.setHours(krajRadnogVremena.getHours() + 2);
                if (pocetakRezervacije < pocetakRadnogVremena || krajRezervacije > krajRadnogVremena) {
                    return res.json("Restoran ne radi u trazenom terminu");
                }
                let slobodniStolovi = yield sto_1.default.find({
                    restoran,
                    brojMesta: { $gte: brojOsoba }
                });
                if (slobodniStolovi.length == 0) {
                    return res.json("Ne postoji sto u restoranu sa dovoljnim kapacitetom!");
                }
                let rezervacije = yield rezervacija_1.default.find({ status: { $in: ['naCekanju', 'potvrdjena'] } });
                rezervacije = rezervacije.filter(rez => {
                    const pocetakRez = new Date(rez.datum);
                    const krajRez = new Date(rez.datum);
                    krajRez.setHours(krajRez.getHours() + 3);
                    if (!(pocetakRezervacije >= krajRez || krajRezervacije <= pocetakRez)) {
                        return true;
                    }
                    return false;
                });
                let trazeniStoId = -1;
                let noviStolovi = [];
                const stoId = Array.from(new Set(rezervacije.map(rez => rez.sto)));
                noviStolovi = slobodniStolovi.filter(sto => {
                    if (stoId.includes(sto.id)) {
                        return false;
                    }
                    return true;
                });
                if (noviStolovi.length == 0) {
                    return res.json("Ne postoji slobodan sto u trazeno vreme!");
                }
                noviStolovi.sort((a, b) => a.brojMesta - b.brojMesta);
                trazeniStoId = noviStolovi[0].id;
                let maxId = 0;
                yield rezervacija_1.default.find({}).then(rez => {
                    rez.forEach(r => {
                        if (r.id > maxId) {
                            maxId = r.id;
                        }
                    });
                });
                maxId = maxId + 1;
                const novaRezervacija = new rezervacija_1.default({
                    datum: pocetakRezervacije.toISOString(),
                    sto: null,
                    gost: gost,
                    opis: opis,
                    status: "naCekanju",
                    komentarKonobara: "",
                    konobar: "",
                    brojGostiju: brojOsoba,
                    id: maxId,
                    restoran: restoran
                });
                yield novaRezervacija.save();
                res.json("Uspesno ste poslali zahtev za rezervacijom!");
            }
            catch (err) {
                console.log(err);
            }
        }));
    }
}
exports.RestoranController = RestoranController;
