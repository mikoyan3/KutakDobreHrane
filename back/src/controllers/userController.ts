import * as express from "express";
import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import Gost from "../models/gost"
import Konobar from "../models/konobar";
import Admin from "../models/admin"
import Rezervacija from "../models/rezervacija"
import Restoran from "../models/restoran"
import gost from "../models/gost";
import konobar from "../models/konobar";
const bcrypt = require('bcrypt');

export class UserController{
    login = (req: express.Request, res: express.Response)=>{
       let username = req.body.username;
       let password = req.body.password;
       let userRole = req.body.userRole;

       if(userRole == "gost"){
        Gost.findOne({username: username}).then(async korisnik=>{
            if(korisnik != null){
                const storedPassword = korisnik.password;
                let passwordMatch = false;
                if(storedPassword != null && (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$'))){ 
                    passwordMatch = await bcrypt.compare(password, storedPassword);
                } else {
                    passwordMatch = (password == storedPassword);
                }
                if(passwordMatch){
                    if(korisnik.status == "odobren"){
                        res.json({userType: 'gost', user: korisnik});
                    } else if(korisnik.status == "neodobren"){
                        res.json({userType: 'Korisnik nije odobren!', user: korisnik});
                    } else if(korisnik.status == "odbijen"){
                        res.json({userType: 'Zahtev za registracijom korisnika je odbijen!', user: korisnik});
                    } else {
                        res.json({userType: "Korisnik je deaktiviran", user: korisnik});
                    }
                } else {
                    res.json({userType: 'Lozinka je pogresna!', user: null})
                }
            } else {
                res.json({userType: 'Korisnik sa unetim username-om ne postoji', user: null})
            }
        }).catch(err=>{
            console.log(err);
        })
       } else {
        Konobar.findOne({username: username}).then(async korisnik=>{
            if(korisnik != null){
                const storedPassword = korisnik.password;
                let passwordMatch = false;
                if(storedPassword != null && (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$'))){ 
                    passwordMatch = await bcrypt.compare(password, storedPassword);
                } else {
                    passwordMatch = (password == storedPassword);
                }
                if(passwordMatch){
                    if(korisnik.status == "odobren"){
                        res.json({userType: 'konobar', user: korisnik})
                    }else{
                        res.json({userType: "Korisnik je deaktiviran", user: korisnik});
                    }
                } else {
                    res.json({userType: 'Lozinka je pogresna!', user: null})
                }
            } else {
                res.json({userType: 'Korisnik sa unetim username-om ne postoji', user: null})
            }
        }).catch(err=>{
            console.log(err)
        })
       }
    }

    login_admin = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;
        Admin.findOne({username: username, password: password}).then(kor=>{
            if(kor == null){
                res.json({message: "Korisnicko ime i/ili lozinka pogresni!", user: null});
            } else {
                res.json({message: "Uspesno", user: kor});
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    registerKonobar(req: express.Request, res: express.Response): Promise<void>{
        return new Promise<void>(async (resolve, reject) => {
            try{
                let username = req.body.username;
                const postojiKon = await Konobar.findOne({username: username});
                const postojiGos = await Gost.findOne({username: username});
                if(postojiKon || postojiGos){
                    res.json("Korisnik vec postoji");
                    return resolve();
                }
                const postojiMailKon = await Konobar.findOne({email: req.body.email});
                const postojiMailGos = await Gost.findOne({email: req.body.email});
                if(postojiMailGos || postojiMailKon){
                    res.json("Korisnik sa ovim mail-om vec postoji!")
                    return resolve();
                }
                const file: Express.Multer.File = (req as Request).file;
                const filename: string = file ? file.originalname : null;
                const profilePictureUrl = filename || "placeholder.jpg";

                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const user = new konobar({
                    username: req.body.username,
                    password: hashedPassword,
                    securityQuestion: req.body.securityQuestion,
                    securityAnswer: req.body.securityAnswer,
                    name: req.body.name,
                    surname: req.body.surname,
                    gender: req.body.gender,
                    address: req.body.address,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email,
                    pictureUrl: profilePictureUrl,
                    restoran: req.body.restoran,
                    status: "odobren"
                });
                await user.save();
                res.json("Uspesno ste poslali zahtev za registracijom!");
                resolve();
            } catch(error){
                console.log("Neuspeh");
                reject(error);
            } 
        });
    }

    registerGost(req: express.Request, res: express.Response): Promise<void>{
        return new Promise<void>(async (resolve, reject) => {
            try{
                let username = req.body.username;
                const postojiKon = await Konobar.findOne({username: username});
                const postojiGos = await Gost.findOne({username: username});
                if(postojiKon || postojiGos){
                    res.json("Korisnik vec postoji");
                    return resolve();
                }
                const postojiMailKon = await Konobar.findOne({email: req.body.email});
                const postojiMailGos = await Gost.findOne({email: req.body.email});
                if(postojiMailGos || postojiMailKon){
                    res.json("Korisnik sa ovim mail-om vec postoji!")
                    return resolve();
                }
                const file: Express.Multer.File = (req as Request).file;
                const filename: string = file ? file.originalname : null;
                const profilePictureUrl = filename || "placeholder.jpg";

                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const user = new gost({
                    username: req.body.username,
                    password: hashedPassword,
                    securityQuestion: req.body.securityQuestion,
                    securityAnswer: req.body.securityAnswer,
                    name: req.body.name,
                    surname: req.body.surname,
                    gender: req.body.gender,
                    address: req.body.address,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email,
                    pictureUrl: profilePictureUrl,
                    creditCardNumber: req.body.creditCardNumber,
                    status: "neodobren"
                });
                await user.save();
                res.json("Uspesno ste poslali zahtev za registracijom!");
                resolve();
            } catch(error){
                console.log("Neuspeh");
                reject(error);
            } 
        });
    }

    updatePictureGost = (req: express.Request, res: express.Response)=>{
        const file: Express.Multer.File = (req as Request).file;
        let filename: string = file.originalname;
        if (!file || !filename) {
            console.log("Neuspeh");
            return;
        }
        const URL = file.filename;
        Gost.findOneAndUpdate({username: req.body.username}, {$set: {pictureUrl: URL}}).then(resp=>{
            res.json(resp);
        }).catch(err=>{
            console.log(err);
        })
    }

    updatePictureKonobar = (req: express.Request, res: express.Response)=>{
        const file: Express.Multer.File = (req as Request).file;
        let filename: string = file.originalname;
        if (!file || !filename) {
            console.log("Neuspeh");
            return;
        }
        const URL = file.filename;
        Konobar.findOneAndUpdate({username: req.body.username}, {$set: {pictureUrl: URL}}).then(resp=>{
            res.json(resp);
        }).catch(err=>{
            console.log(err);
        })
    }

    promenaLozinke = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;
        let newPassword = req.body.newPassword;
        Gost.findOne({username: username}).then(async kor=>{
            if(kor == null){
                Konobar.findOne({username: username}).then(async kon=>{
                    if(kon == null || kon.status != "odobren"){
                        res.json({message: "Korisnik ne postoji!", user: null});
                    } else {
                        const storedPassword = kon.password;
                        let passwordMatch = false;
                        if(storedPassword != null && (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$'))){ 
                            passwordMatch = await bcrypt.compare(password, storedPassword);
                        } else {
                            passwordMatch = (password == storedPassword);
                        }
                        if(passwordMatch){ // ako se passwordi poklapaju
                            const hashedPassword = await bcrypt.hash(newPassword, 10);
                            kon.password = hashedPassword;
                            kon.save();
                            res.json({message: "Promenjena sifra", user: kon});
                        } else { // ako se ne poklapaju
                            res.json({message: "Stari password nije odgovarajuci!", user:null});
                        }
                    }
                })
            } else {
                if(kor.status == "odobren"){
                    const storedPassword = kor.password;
                    let passwordMatch = false;
                    if(storedPassword != null && (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$'))){
                        passwordMatch = await bcrypt.compare(password, storedPassword);
                    } else {
                        passwordMatch = (password == storedPassword);
                    }
                    if(passwordMatch){ // ako se passwordi poklapaju
                        const hashedPassword = await bcrypt.hash(newPassword, 10);
                        kor.password = hashedPassword;
                        kor.save();
                        res.json({message: "Promenjena sifra", user: kor});
                    } else{ // ako se passwordi ne poklapaju
                        res.json({message: "Stari password nije odgovarajuci!", user:null});
                    }
                } else {
                    res.json({message: "Korisnik nije jos uvek odobren", user: null});
                }
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    dohvatanjeKorisnikaNaOsnovuUsername = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        Gost.findOne({username: username}).then(kor=>{
            if(kor == null){
                Konobar.findOne({username: username}).then(kon=>{
                    if(kon != null){
                        res.json({message: "Korisnik postoji", user: kon});
                    } else {
                        res.json({message: "Korisnik ne postoji!", user: null});
                    }
                })
            } else {
                res.json({message: "Korisnik postoji", user: kor});
            }
        })
    }

    novaLozinka = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let newPassword = req.body.newPassword;
        Gost.findOne({username: username}).then(async kor=>{
            if(kor == null){
                Konobar.findOne({username: username}).then(async kon=>{
                    if(kon == null || kon.status != "odobren"){
                        res.json({message: "Korisnik ne postoji!", user: null});
                    } else {
                        const hashedPassword = await bcrypt.hash(newPassword, 10);
                        kon.password = hashedPassword;
                        kon.save();
                        res.json({message: "Promenjena sifra", user: kon});
                    }
                })
            } else {
                if(kor.status == "odobren"){
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    kor.password = hashedPassword;
                    kor.save();
                    res.json({message: "Promenjena sifra", user: kor});
                } else {
                    res.json({message: "Korisnik nije aktivan", user: null});
                }
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    getNumberOfRegisteredGost = (req: express.Request, res: express.Response)=>{
        Gost.find({status: "odobren"}).then(rez=>{
            let numberOfGost = rez.length;
            res.json(numberOfGost);
        }).catch(err=>{
            console.log(err);
        })
    }

    getAllKonobari = (req: express.Request, res: express.Response)=>{
        Konobar.find({status: "odobren"}).then(rez=>{
            res.json(rez);
        }).catch(err=>{
            console.log(err);
        })
    }

    getFileGost = (req: express.Request, res: express.Response) =>{
        const directory = path.join(__dirname, "../../uploads");
        let username = req.body.username;
        Gost.findOne({username: username}).then(korisnik=>{
            const filePath = path.join(directory, korisnik.pictureUrl);
            if(fs.existsSync(filePath)){
                res.type('application/octet-stream').sendFile(filePath);
            } else {
                return;
            }
        })
    }

    getFileKonobar = (req: express.Request, res: express.Response) =>{
        const directory = path.join(__dirname, "../../uploads");
        let username = req.body.username;
        Konobar.findOne({username: username}).then(korisnik=>{
            const filePath = path.join(directory, korisnik.pictureUrl);
            if(fs.existsSync(filePath)){
                res.type('application/octet-stream').sendFile(filePath);
            } else {
                return;
            }
        })
    }

    updateProfileGost(req, res) {
        let updatedProfile = req.body;
        let username = req.params.username;
      
        Gost.findOneAndUpdate({ username: username }, updatedProfile, { new: true }).then(updatedUser => {
          res.json(updatedUser);
        }).catch(err => {
          console.log(err);
        });
    }

    updateProfileKonobar(req, res) {
        let updatedProfile = req.body;
        let username = req.params.username;
      
        Konobar.findOneAndUpdate({ username: username }, updatedProfile, { new: true }).then(updatedUser => {
          res.json(updatedUser);
        }).catch(err => {
          console.log(err);
        });
    }

    getInfoForStatistics = async(req, res)=>{
        try{
            let konobar = req.body.konobar;
            let restoran = req.body.restoran;
            let rezervacije = await Rezervacija.find({konobar: konobar});
            let weeklyGosti = {
                'MON': 0,
                'TUE': 0,
                'WED': 0,
                'THU': 0,
                'FRI': 0,
                'SAT': 0,
                'SUN': 0
            };
            rezervacije.forEach(rez=>{
                let datum = new Date(rez.datum);
                let brojGostiju = rez.brojGostiju;
                let danUNedelji = datum.getDay();
                let danString = '';
                switch (danUNedelji) {
                    case 0:
                        danString = 'SUN';
                        break;
                    case 1:
                        danString = 'MON';
                        break;
                    case 2:
                        danString = 'TUE';
                        break;
                    case 3:
                        danString = 'WED';
                        break;
                    case 4:
                        danString = 'THU';
                        break;
                    case 5:
                        danString = 'FRI';
                        break;
                    case 6:
                        danString = 'SAT';
                        break;
                    default:
                        break;
                }
                weeklyGosti[danString] += brojGostiju;
            })
            
            let konobari = await Konobar.find({restoran: req.body.restoran});
            let gostiPoKonobaru = {};
            konobari.forEach(kon=>{
                gostiPoKonobaru[kon.username] = 0;
            })
            
            let allRezervacije = await Rezervacija.find({restoran: restoran})
            allRezervacije.forEach(rez=>{
                let username = rez.konobar;
                let brojGostiju = rez.brojGostiju;
                gostiPoKonobaru[username] += brojGostiju;
            })

            let formatedGostiPoKonobaru = Object.keys(gostiPoKonobaru).map(username=>{
                return {username: username, sumBrojGostiju: gostiPoKonobaru[username]};
            })

            let trenDatum = new Date();
            trenDatum.setHours(trenDatum.getHours() + 2);
            let dvegodine = new Date();
            dvegodine.setHours(dvegodine.getHours() + 2);
            dvegodine.setMonth(dvegodine.getMonth() - 24);

            let rezerv = await Rezervacija.find({restoran: restoran});
            let rezervacijeZadnjeDveGodine = [];
            rezerv.forEach(rez=>{
                let datumrez = new Date(rez.datum)
                if(datumrez >= dvegodine){
                    rezervacijeZadnjeDveGodine.push(rez);
                }
            });
            let daniUNedelji = {
                'SUN': 0,
                'MON': 0,
                'TUE': 0,
                'WED': 0,
                'THU': 0,
                'FRI': 0,
                'SAT': 0
            };
    
            let daniAvg = {
                'MON': 0,
                'TUE': 0,
                'WED': 0,
                'THU': 0,
                'FRI': 0,
                'SAT': 0,
                'SUN': 0
            };

            rezervacijeZadnjeDveGodine.forEach(rez=>{
                const dan = new Date(rez.datum).getDay();
                switch (dan) {
                    case 0:
                        daniUNedelji['SUN']++;
                        break;
                    case 1:
                        daniUNedelji['MON']++;
                        break;
                    case 2:
                        daniUNedelji['TUE']++;
                        break;
                    case 3:
                        daniUNedelji['WED']++;
                        break;
                    case 4:
                        daniUNedelji['THU']++;
                        break;
                    case 5:
                        daniUNedelji['FRI']++;
                        break;
                    case 6:
                        daniUNedelji['SAT']++;
                        break;
                }
            })
            const konstantaZaDeljenje = 24 * 4.345;
            Object.keys(daniUNedelji).forEach(dan=>{
                daniAvg[dan] = daniUNedelji[dan] / konstantaZaDeljenje;
            });

            res.json({dijagramKolona: weeklyGosti, dijagramPita: formatedGostiPoKonobaru, dijagramHistogram: daniAvg});
        } catch (error){
            console.log(error);
        }
    }

    fetchAllInfoAdministrator = async(req, res)=>{
        try{
            let konobari = await Konobar.find({status: "odobren"});
            let odobreniGosti = await Gost.find({status: "odobren"});
            let zahteviGosti = await Gost.find({status: "neodobren"});
            let restorani = await Restoran.find({});
            res.json({konobari: konobari, odobreniGosti: odobreniGosti, zahteviGosti: zahteviGosti, restorani: restorani});
        } catch(error){
            console.log(error);
        }
    }

    deaktivirajKorisnika = async(req, res)=>{
        try{
            let tip = req.body.tip;
            let korisnik = req.body.korisnik;
            if(tip == 'gost'){
                let gost = await Gost.findOne({username: korisnik});
                gost.status = "deaktiviran";
                await gost.save();
                res.json("Uspeh")
            } else {
                let konobar = await Konobar.findOne({username: korisnik});
                konobar.status = "deaktiviran";
                await konobar.save();
                res.json("Uspeh");
            }
        } catch(error){
            console.log(error);
        }
    }

    prihvatiKorisnika = async(req, res)=>{
        try{
            let korisnik = req.body.korisnik;
            let gost = await Gost.findOne({username: korisnik});
            gost.status = "odobren";
            await gost.save();
            res.json("Uspeh");
        } catch(error){
            console.log(error)
        }
    }

    odbijKorisnika = async(req, res)=>{
        try{
            let korisnik = req.body.korisnik;
            let gost = await Gost.findOne({username: korisnik});
            gost.status = "odbijen";
            await gost.save();
            res.json("Uspeh");
        } catch(error){
            console.log(error)
        }
    }
}