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
import rezervacija from "../models/rezervacija";
import Sto from "../models/sto"
import RadnoVremeRestorana from "../models/radnoVremeRestorana"
import Jelo from "../models/jelo";

const bcrypt = require('bcrypt');

export class RestoranController{
    getNumberOfRestoran = (req: express.Request, res: express.Response)=>{
        Restoran.find({}).then(rez=>{
            let numberOfRestoran = rez.length;
            res.json({count: numberOfRestoran});
        }).catch(err=>{
            console.log(err);
        })
    }

    getReservationsCount = (timeFrame, res) => {
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

      Rezervacija.find({}).then(rezultati=>{
        let cnt = 0;
        rezultati.forEach(rez=>{
          let datum = new Date(rez.datum);
          if(datum >= startDate && datum <= endDate) cnt++;
        })
        res.json({count: cnt});
      })
    };
  
    getReservationsLast24Hours = (req, res) => {
        this.getReservationsCount('24h', res);
    };
      
    getReservationsLast7Days = (req, res) => {
        this.getReservationsCount('7d', res);
    };
      
    getReservationsLastMonth = (req, res) => {
        this.getReservationsCount('1m', res);
    };
  

    getAllRestorani = (req, res) => {
        Restoran.find({}).then(restorani=>{
          res.json(restorani);
        }).catch(err=>{
            console.log(err);
        })
    }

    getAllRestoraniWithRatings = async (req, res) => {
        try{
            const ratings = await Recenzija.aggregate([{
                $group: {
                    _id: "$restoran",
                    avgRating: {$avg: "$ocena"}
                }
            }]);

            const ratingsMap = {};
            ratings.forEach(rating => {
            ratingsMap[rating._id] = rating.avgRating;
            });

            
            const restorani = await Restoran.find();

            
            const restoraniWithRatings = restorani.map(restoran => {
            const restoranObject = restoran.toObject();
            return {
                ...restoranObject,
                avgRating: ratingsMap[restoran.naziv] || 0
            };
            });

            
            res.json(restoraniWithRatings);
        } catch (err){
            console.log(err);
        }
    }

    getRestoranWithNaziv = (req: express.Request, res: express.Response)=>{
        let naziv = req.body.naziv;
        Restoran.findOne({naziv: naziv}).then(rez=>{
            res.json(rez);
        }).catch(err=>{
            console.log(err)
        })
    }

    getRecenzijeForRestoran = (req: express.Request, res: express.Response)=>{
        let naziv = req.body.naziv;
        Recenzija.find({restoran: naziv}).then(rez=>{
            res.json(rez);
        }).catch(err=>{
            console.log(err);
        })
    }

    kreirajRezervaciju(req: express.Request, res: express.Response): Promise<void>{
        return new Promise<void>(async (resolve, reject) => {
            let datum = req.body.datum;
            let brojOsoba = req.body.brojOsoba;
            let opis = req.body.opis;
            let restoran = req.body.restoran;
            let gost = req.body.gost;
            try{
                const pocetakRezervacije = new Date(datum);
                pocetakRezervacije.setHours(pocetakRezervacije.getHours() + 2);
                const krajRezervacije = new Date(datum);
                krajRezervacije.setHours(krajRezervacije.getHours() + 5);
                const radnoVreme = await RadnoVremeRestorana.findOne({restoran});
                const pocetakRadnogVremena = new Date(pocetakRezervacije.getFullYear(), pocetakRezervacije.getMonth(), pocetakRezervacije.getDate(), parseInt(radnoVreme.pocetak.split(':')[0]), parseInt(radnoVreme.pocetak.split(':')[1]));
                const krajRadnogVremena = new Date(pocetakRezervacije.getFullYear(), pocetakRezervacije.getMonth(), pocetakRezervacije.getDate(), parseInt(radnoVreme.kraj.split(':')[0]), parseInt(radnoVreme.kraj.split(':')[1]));
                pocetakRadnogVremena.setHours(pocetakRadnogVremena.getHours() + 2);
                krajRadnogVremena.setHours(krajRadnogVremena.getHours() + 2);
                if(pocetakRezervacije < pocetakRadnogVremena || krajRezervacije > krajRadnogVremena){
                    return res.json("Restoran ne radi u trazenom terminu");
                }
                let slobodniStolovi = await Sto.find({
                    restoran, 
                    brojMesta: { $gte: brojOsoba}
                })

                if(slobodniStolovi.length == 0){
                    return res.json("Ne postoji sto u restoranu sa dovoljnim kapacitetom!")
                }

                let rezervacije = await Rezervacija.find({status: {$in: ['naCekanju', 'potvrdjena']}})
                
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
                const stoId = Array.from(new Set(rezervacije.map(rez=>rez.sto)));
                
                noviStolovi = slobodniStolovi.filter(sto=>{
                    if(stoId.includes(sto.id)){
                        return false;
                    }
                    return true;
                })
                if(noviStolovi.length == 0){
                    return res.json("Ne postoji slobodan sto u trazeno vreme!")
                }

                noviStolovi.sort((a, b) => a.brojMesta - b.brojMesta);
                trazeniStoId = noviStolovi[0].id;
                let maxId = 0;
                await Rezervacija.find({}).then(rez=>{
                    rez.forEach(r=>{
                        if(r.id > maxId){
                            maxId = r.id;
                        }
                    })
                })
                maxId = maxId + 1;
                const novaRezervacija = new Rezervacija({
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
                })

                await novaRezervacija.save();
                res.json("Uspesno ste poslali zahtev za rezervacijom!")
            } catch (err){
                console.log(err);
            }
        });
    }

    getJelaForRestoran = (req: express.Request, res: express.Response)=>{
        let restoran = req.body.restoran;
        Jelo.find({restoran: restoran}).then(rez=>{
            res.json(rez);
        }).catch(err=>{
            console.log(err);
        })
    }

    getSlikaJelo = (req: express.Request, res: express.Response) =>{
        const directory = path.join(__dirname, "../../uploads");
        let jeloId = req.body.jeloId;
        Jelo.findOne({id: jeloId}).then(rez=>{
            const filePath = path.join(directory, rez.slika);
            if(fs.existsSync(filePath)){
                res.type('application/octet-stream').sendFile(filePath);
            } else {
                return;
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    getLayoutForRestoran = async(req, res) => {
        try{
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

            let restoran = await Restoran.findOne({naziv: rezervacija.restoran});
            let rezervacije = await Rezervacija.find({restoran: restoran.naziv});
            let preklapajuceRezervacije = [];
            rezervacije.forEach(rez=>{
                let datumPocetka = new Date(rez.datum);
                let datumKraja = new Date(rez.datum);
                datumKraja.setHours(datumKraja.getHours() + 3);
                if(!(datumPocetka >= gornjaGranica || datumKraja <= donjaGranica)){
                    preklapajuceRezervacije.push(rez);
                }
            })
            let stolovi = await Sto.find({restoran: restoran.naziv})
            let zauzetiStolovi = []
            let slobodniStolovi = []
            let flag = false;
            stolovi.forEach(sto=>{
                preklapajuceRezervacije.forEach(rez=>{
                    if(rez.status != "naCekanju"){
                        if(rez.sto == sto.id) {
                            flag = true;
                        }
                    }
                })
                if(flag == true){
                    zauzetiStolovi.push(sto);
                    flag = false;
                } else {
                    slobodniStolovi.push(sto);
                }
            })
            res.json({restoran: restoran, zauzetiStolovi: zauzetiStolovi, slobodniStolovi: slobodniStolovi});
        } catch (error){
            console.log(error)
        }
    }
}