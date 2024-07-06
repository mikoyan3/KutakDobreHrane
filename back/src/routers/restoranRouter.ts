import express from "express";
import { RestoranController } from "../controllers/restoranController";
import multer from "multer";
import * as fs from "fs";
import Restoran from "../models/restoran"
import Sto from "../models/sto"
import radnoVremeRestorana from "../models/radnoVremeRestorana";

const path = require('path');
const restoranRouter = express.Router();
const restoranController = new RestoranController();
const upload = multer({dest: 'uploads/'});


restoranRouter.route("/getNumberOfRestoran").get((req,res)=>restoranController.getNumberOfRestoran(req,res));
restoranRouter.route("/getReservationsLast24Hours").get((req,res)=>restoranController.getReservationsLast24Hours(req,res));
restoranRouter.route("/getReservationsLast7Days").get((req,res)=>restoranController.getReservationsLast7Days(req,res));
restoranRouter.route("/getReservationsLastMonth").get((req,res)=>restoranController.getReservationsLastMonth(req,res));
restoranRouter.route("/getAllRestorani").get((req,res)=>restoranController.getAllRestorani(req,res));
restoranRouter.route("/getAllRestoraniWithRatings").get((req,res)=>restoranController.getAllRestoraniWithRatings(req,res));
restoranRouter.route("/getRestoranWithNaziv").post((req,res)=>restoranController.getRestoranWithNaziv(req,res));
restoranRouter.route("/getRecenzijeForRestoran").post((req,res)=>restoranController.getRecenzijeForRestoran(req,res));
restoranRouter.route("/kreirajRezervaciju").post((req,res)=>restoranController.kreirajRezervaciju(req,res));
restoranRouter.route("/getJelaForRestoran").post((req,res)=>restoranController.getJelaForRestoran(req,res));
restoranRouter.route("/getSlikaJelo").post((req,res)=>restoranController.getSlikaJelo(req,res));
restoranRouter.route("/getLayoutForRestoran").post((req,res)=>restoranController.getLayoutForRestoran(req,res));




restoranRouter.post('/upload-layout', upload.single('layout'), async(req, res)=>{
    const filePath = path.join(__dirname, "../../", req.file.path);
    try{
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const restoranData = data.restoran;
        let pocetak = req.body.pocetakRadnogVremena;
        let kraj = req.body.krajRadnogVremena;
        let radnoVreme = new radnoVremeRestorana({
            restoran: req.body.naziv,
            pocetak: pocetak,
            kraj: kraj
        });
        await radnoVreme.save();
        let restoran = new Restoran({
            naziv: req.body.naziv,
            adresa: req.body.adresa,
            tip: req.body.tip,
            telefon: req.body.telefon,
            opis: req.body.opis,
            kitchen: restoranData.kitchen,
            toilets: restoranData.toilets
        });
        await restoran.save();

        const stolovi = await Sto.find({});
        let nextId = 0;
        stolovi.forEach(sto=>{
            if(sto.id > nextId){
                nextId = sto.id;
            }
        })
        nextId = nextId + 1;

        const tablePromises = data.tables.map(table => {
            return new Sto({
                ...table,
                restoran: req.body.naziv,
                id: nextId++
            }).save();
        });
        await Promise.all(tablePromises);

        res.json("Uspesno dodat restoran")
    } catch (error){
        console.error('Desila se greska');
        res.json("Desila se greska");
    } finally {
        fs.unlinkSync(filePath);
    }
})
export default restoranRouter;