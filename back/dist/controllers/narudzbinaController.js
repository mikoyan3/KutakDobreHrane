"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NarudzbinaController = void 0;
const deoNarudzbine_1 = __importDefault(require("../models/deoNarudzbine"));
const narudzbina_1 = __importDefault(require("../models/narudzbina"));
const bcrypt = require('bcrypt');
class NarudzbinaController {
    constructor() {
        this.generisiNovuNarudzbinu = (req, res) => {
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
            let nar = new narudzbina_1.default({
                restoran: restoran,
                status: status,
                minVremeDostave: minVremeDostave,
                maxVremeDostave: maxVremeDostave,
                datum: datum.toISOString(),
                gost: gost,
                deoNarudzbine: deloviNarudzbine,
                cena: cena
            });
            nar.save();
            res.json("Uspesno ste kreirali zahtev za narudzbinom! Molimo sacekajte potvrdu konobara!");
        };
    }
}
exports.NarudzbinaController = NarudzbinaController;
