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

const bcrypt = require('bcrypt');

export class RezervacijeController{
    getAktuelneRezervacije = async(req, res) =>{
        try{
            let gost = req.body.gost;
            let trenutniDatum = new Date();
            trenutniDatum.setHours(trenutniDatum.getHours() + 2);
            let rezervacije = await Rezervacija.find({gost: gost, status: "potvrdjena"});
            let buduceRezervacije = [];
            rezervacije.forEach(rez=>{
                let datumRez = new Date(rez.datum);
                if(datumRez >= trenutniDatum){
                    buduceRezervacije.push(rez);
                }
            })
            let restorani = await Restoran.find({});
            if(buduceRezervacije.length == 0){
                res.json({message: 'Nema aktuelnih rezervacija', rezervacije: [], restorani: []});
            } else{
                res.json({message: 'Aktuelne rezervacije postoje', rezervacije: buduceRezervacije, restorani: restorani});
            }
            
        } catch(err){
            console.log(err);
        }
    }

    getArhiviraneRezervacije = async(req, res)=>{
        try{
            let gost = req.body.gost;
            let trenutniDatum = new Date();
            trenutniDatum.setHours(trenutniDatum.getHours() + 2);
            let rezervacije = await Rezervacija.find({gost: gost, status: { $nin: ["naCekanju", "potvrdjena"]}});
            let arhiviraneRez = [];
            rezervacije.forEach(rez=>{
                let datumRez = new Date(rez.datum);
                if(datumRez < trenutniDatum){
                    arhiviraneRez.push(rez);
                }
            })

            let recenzije = await Recenzija.find({});
            let matchingRecenzije = [];
            recenzije.forEach(rec=>{
                arhiviraneRez.forEach(rez=>{
                    if(rec.rezervacijaId == rez.id){
                        matchingRecenzije.push(rec);
                    }
                })
            })
            let stolovi = await Sto.find({});
            if(arhiviraneRez.length == 0){
                res.json({message: "Nema arhiviranih rezervacija!", rezervacije: [], recenzije: [], stolovi: []})
            } else {
                res.json({message: "Arhivirane rezervacije postoje!", rezervacije: arhiviraneRez, recenzije: matchingRecenzije, stolovi: stolovi});
            }
        } catch(err){
            console.log(err);
        }
    }

    otkaziRezervaciju = async(req, res)=>{
        let id = req.body.id;
        let rezervacija = await Rezervacija.deleteOne({id: id});
        res.json("Uspesno obrisana rezervacija!")
    }

    ostaviRecenziju = async(req, res)=>{
        let id = req.body.id;
        let komentar = req.body.komentar;
        let ocena = req.body.ocena;
        let restoran = req.body.restoran;
        let rezervacija = await Rezervacija.findOne({id: id});
        if(rezervacija){
            const newRecenzija = new Recenzija({
                restoran: restoran,
                rezervacijaId: id,
                ocena: ocena,
                komentar: komentar
            });
            await newRecenzija.save();
            res.json("Uspesno ste ostavili recenziju!");
        } else {
            res.json("Vec postoji recenzija za datu rezervaciju!");
        }
    }

    getNeobradjeneRezervacije = async(req, res) => {
        try{
            let rezervacije = await Rezervacija.find({restoran: req.body.restoran, status: 'naCekanju'})
            let rezervacijeUBuducnosti = []
            let trenutniDatum = new Date();
            trenutniDatum.setHours(trenutniDatum.getHours() + 2);
            for(let rez of rezervacije){
                let datumRez = new Date(rez.datum);
                if(!(datumRez < trenutniDatum)){
                    rezervacijeUBuducnosti.push(rez);
                } else {
                    rez.status = "odbijena";
                    await rez.save();
                }
            }
            res.json(rezervacijeUBuducnosti);
        } catch(err){
            console.log(err);
        }
    }

    getRezervacija = async(req, res) => {
        try{
            let id = req.body.id;
            let rezervacija = await Rezervacija.findOne({id: id})
            res.json(rezervacija)
        } catch (error){
            console.log(error)
        }
    }

    potvrdiRezervaciju = async(req, res) => {
        try{
            let rezId = req.body.rezId;
            let sto = req.body.sto;
            let konobar = req.body.konobar;
            let rezervacija = await Rezervacija.findOne({id: rezId});
            rezervacija.sto = sto;
            rezervacija.status = "potvrdjena";
            rezervacija.konobar = konobar;
            await rezervacija.save();
            res.json("Uspesno ste potvrdili rezervaciju!")
        } catch(error){
            console.log(error);
        }
    }

    odbijRezervaciju = async(req, res) => {
        try{
            let komentar = req.body.komentar;
            let rezId = req.body.rezId;
            let kon = req.body.konobar;
            let rezervacija = await Rezervacija.findOne({id: rezId})
            rezervacija.komentarKonobara = komentar;
            rezervacija.status = "odbijena";
            rezervacija.konobar = kon;
            await rezervacija.save();
            res.json("Uspesno ste odbili rezervaciju!");
        } catch(error){
            console.log(error)
        }
    }

    getRezervacijeZaPotvrdu = async(req, res) => {
        try{
            let konobar = req.body.konobar;
            let trenutniDatum = new Date();
            trenutniDatum.setHours(trenutniDatum.getHours() + 2);
            trenutniDatum.setMinutes(trenutniDatum.getMinutes() - 30);
            let rezervacije = await Rezervacija.find({konobar: konobar, status: 'potvrdjena'});
            let rezervacijeZaPotvrdu = [];
            rezervacije.forEach(rez=>{
                let datum = new Date(rez.datum);
                datum.setHours(datum.getHours() + 3);
                if(datum <= trenutniDatum) {
                    rezervacijeZaPotvrdu.push(rez);
                }
            })
            res.json(rezervacijeZaPotvrdu);
        } catch (error){
            console.log(error);
        }
    } 

    potvrdiDolazak = async(req, res) => {
        try{
            let rezId = req.body.rezId; 
            let rezervacija = await Rezervacija.findOne({id: rezId});
            rezervacija.status = "ostvarena";
            await rezervacija.save();
            res.json("Uspeh!");
        } catch(error){
            console.log(error);
        }
    }

    odbijDolazak = async(req, res) => {
        try{
            let rezId = req.body.rezId; 
            let rezervacija = await Rezervacija.findOne({id: rezId});
            rezervacija.status = "neostvarena";
            await rezervacija.save();
            res.json("Uspeh!");
        } catch(error){
            console.log(error);
        }
    }
}