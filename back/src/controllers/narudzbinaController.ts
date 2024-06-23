import * as express from "express";
import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import Gost from "../models/gost"
import Konobar from "../models/konobar";
import Admin from "../models/admin"
import gost from "../models/gost";
import Restoran from "../models/restoran"
import Rezervacija from "../models/rezervacija"
import Recenzija from "../models/recenzija"
import Sto from "../models/sto"
import RadnoVremeRestorana from "../models/radnoVremeRestorana"
import Jelo from "../models/jelo";
import deoNarudzbine from "../models/deoNarudzbine";
import narudzbina from "../models/narudzbina";
import { deoNarudzbineHelper } from "../models/deoNarudzbineHelper";

const bcrypt = require('bcrypt');

export class NarudzbinaController{
    generisiNovuNarudzbinu = (req: express.Request, res: express.Response)=>{
        let delovi: deoNarudzbineHelper[] = req.body.delovi;
        let restoran = req.body.restoran;
        let status = "naCekanju";
        let minVremeDostave = 0;
        let maxVremeDostave = 0;
        let datum = new Date();
        datum.setHours(datum.getHours() + 2);
        let gost = req.body.gost;
        let cena = 0;
        let deloviNarudzbine = [];
        delovi.forEach(deo=>{
            let dn = new deoNarudzbine({
                jelo: deo.jelo,
                kolicina: deo.kolicina,
                cena: deo.cena
            });
            deloviNarudzbine.push(dn);
            cena += deo.cena;
        })
        let nar = new narudzbina({
            restoran: restoran,
            status: status,
            minVremeDostave: minVremeDostave,
            maxVremeDostave: maxVremeDostave,
            datum: datum.toISOString(),
            gost: gost,
            deoNarudzbine: deloviNarudzbine,
            cena: cena
        })
        nar.save();
        res.json("Uspesno ste kreirali zahtev za narudzbinom! Molimo sacekajte potvrdu konobara!")
    }

    
}