import * as express from "express";
import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import Gost from "../models/gost"
import Konobar from "../models/konobar";
import Admin from "../models/admin"
import gost from "../models/gost";
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
                    } else{
                        res.json({userType: 'Zahtev za registracijom korisnika je odbijen!', user: korisnik});
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
                    res.json({userType: 'konobar', user: korisnik})
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

    registerGost(req: express.Request, res: express.Response): Promise<void>{
        return new Promise<void>(async (resolve, reject) => {
            try{
                let username = req.body.username;
                const postoji = await Gost.findOne({username: username});
                if(postoji){
                    res.json("Korisnik vec postoji");
                    return resolve();
                }
                const postojiMail = await Gost.findOne({email: req.body.email})
                if(postojiMail){
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

    promenaLozinke = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;
        let newPassword = req.body.newPassword;
        Gost.findOne({username: username}).then(async kor=>{
            if(kor == null){
                Konobar.findOne({username: username}).then(async kon=>{
                    if(kon == null){
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
                    if(kon == null){
                        res.json({message: "Korisnik ne postoji!", user: null});
                    } else {
                        const hashedPassword = await bcrypt.hash(newPassword, 10);
                        kon.password = hashedPassword;
                        kon.save();
                        res.json({message: "Promenjena sifra", user: kon});
                    }
                })
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                kor.password = hashedPassword;
                kor.save();
                res.json({message: "Promenjena sifra", user: kor});
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
        Konobar.find({}).then(rez=>{
            res.json(rez);
        }).catch(err=>{
            console.log(err);
        })
    }
}