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
exports.NarudzbinaController = void 0;
const jelo_1 = __importDefault(require("../models/jelo"));
const narudzbina_1 = __importDefault(require("../models/narudzbina"));
const deoNarudzbine_1 = __importDefault(require("../models/deoNarudzbine"));
const narudzbina_2 = __importDefault(require("../models/narudzbina"));
const bcrypt = require('bcrypt');
class NarudzbinaController {
    constructor() {
        this.generisiNovuNarudzbinu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let delovi = req.body.delovi;
            let restoran = req.body.restoran;
            let status = "naCekanju";
            let minVremeDostave = 0;
            let maxVremeDostave = 0;
            let datum = new Date();
            datum.setHours(datum.getHours() + 2);
            let gost = req.body.gost;
            let cena = 0;
            let deloviNarudzbine = [];
            delovi.forEach(deo => {
                let dn = new deoNarudzbine_1.default({
                    jelo: deo.jelo,
                    kolicina: deo.kolicina,
                    cena: deo.cena
                });
                deloviNarudzbine.push(dn);
                cena += deo.cena;
            });
            let maxId = 0;
            yield narudzbina_1.default.find({}).then(rez => {
                rez.forEach(r => {
                    if (r.id > maxId) {
                        maxId = r.id;
                    }
                });
            });
            maxId = maxId + 1;
            let nar = new narudzbina_2.default({
                id: maxId,
                restoran: restoran,
                status: status,
                minVremeDostave: minVremeDostave,
                maxVremeDostave: maxVremeDostave,
                datum: datum.toISOString(),
                gost: gost,
                deoNarudzbine: deloviNarudzbine,
                cena: cena
            });
            yield nar.save();
            res.json("Uspesno ste kreirali zahtev za narudzbinom! Molimo sacekajte potvrdu konobara!");
        });
        this.getNarudzbineForGost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let gost = req.body.gost;
                let trenutniDatum = new Date();
                trenutniDatum.setHours(trenutniDatum.getHours() + 2);
                const narudzbine = yield narudzbina_1.default.find({ gost: gost });
                let aktuelne = [];
                let arhivirane = [];
                narudzbine.forEach(nar => {
                    let datumNarKraj = new Date(nar.datum);
                    let maxVreme = nar.maxVremeDostave;
                    if (nar.status == "naCekanju")
                        maxVreme = 60;
                    let minuti = datumNarKraj.getMinutes();
                    if ((maxVreme + minuti) >= 60) {
                        let newMin = maxVreme + minuti - 60;
                        datumNarKraj.setHours(datumNarKraj.getHours() + 1);
                        datumNarKraj.setMinutes(newMin);
                    }
                    else {
                        datumNarKraj.setMinutes(datumNarKraj.getMinutes() + maxVreme);
                    }
                    if (datumNarKraj > trenutniDatum) {
                        aktuelne.push(nar);
                    }
                    else {
                        if (nar.status == 'potvrdjena') {
                            arhivirane.push(nar);
                        }
                    }
                });
                res.json({ aktuelne: aktuelne, arhivirane: arhivirane });
            }
            catch (err) {
                console.log(err);
            }
        });
        this.getTrenutneNarudzbine = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let rest = req.body.res;
                let narudzbine = yield narudzbina_1.default.find({ restoran: rest, status: "naCekanju" });
                res.json(narudzbine);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.odbijNarudzbinu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let narudzbina = req.body.narudzbina;
                let nar = yield narudzbina_1.default.findOne({ id: narudzbina });
                nar.status = "odbijena";
                yield nar.save();
                res.json("Uspeh");
            }
            catch (error) {
                console.log(error);
            }
        });
        this.potvrdiNarudzbinu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let narId = req.body.narId;
                let minVreme = req.body.minVreme;
                let maxVreme = req.body.maxVreme;
                let narudzbina = yield narudzbina_1.default.findOne({ id: narId });
                narudzbina.status = "potvrdjena";
                narudzbina.minVremeDostave = minVreme;
                narudzbina.maxVremeDostave = maxVreme;
                yield narudzbina.save();
                res.json("Uspeh");
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getJelo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let jeloId = req.body.jeloId;
                let jelo = yield jelo_1.default.findOne({ id: jeloId });
                res.json(jelo);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.NarudzbinaController = NarudzbinaController;
