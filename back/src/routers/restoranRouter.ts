import express from "express";
import { RestoranController } from "../controllers/restoranController";
import multer from "multer";
import * as fs from "fs";
import Restoran from "../models/restoran"
import Sto from "../models/sto"

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




restoranRouter.post('/upload-layout', upload.single('layout'), async(req, res)=>{
    const filePath = path.join(__dirname, "../../", req.file.path);
    try{
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const restoranData = data.restoran;
        const restoranNaziv = restoranData.naziv;

        let restoran = await Restoran.findOne({ naziv: restoranNaziv });

        if (restoran) {
            restoran.kitchen = restoranData.kitchen;
            restoran.toilets = restoranData.toilets;
            await restoran.save();
        } else {
            restoran = new Restoran({
                naziv: restoranData.naziv,
                adresa: restoranData.adresa,
                tip: restoranData.tip,
                telefon: restoranData.telefon,
                opis: restoranData.opis,
                kitchen: restoranData.kitchen,
                toilets: restoranData.toilets
            });
            await restoran.save();
        }

        const stolovi = await Sto.find({});
        let nextId = 0;
        stolovi.forEach(sto=>{
            if(sto.id > nextId){
                nextId = sto.id;
            }
        })
        nextId = nextId + 1;
        await Sto.deleteMany({ restoran: restoranNaziv });

        const tablePromises = data.tables.map(table => {
            return new Sto({
                ...table,
                restoran: restoranNaziv,
                id: nextId++
            }).save();
        });
        await Promise.all(tablePromises);

        res.status(200).send('Layout uploaded successfully');
    } catch (error){
        console.error('Desila se greska');
        res.status(500).send('Desila se greska');
    } finally {
        fs.unlinkSync(filePath);
    }
})

restoranRouter.get('/layout', async (req, res) => {
    try {
        const stolovi = await Sto.find({restoran: "Marko's Eatery"});
        const restoran = await Restoran.findOne({naziv: "Marko's Eatery"});

        res.json({restoran: restoran, stolovi: stolovi})
    } catch (error) {
        console.error('Error fetching layout:', error);
        res.status(500).send('Error fetching layout');
    }
});
export default restoranRouter;