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
exports.UserController = void 0;
const gost_1 = __importDefault(require("../models/gost"));
const konobar_1 = __importDefault(require("../models/konobar"));
const admin_1 = __importDefault(require("../models/admin"));
const gost_2 = __importDefault(require("../models/gost"));
const bcrypt = require('bcrypt');
class UserController {
    constructor() {
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            let userRole = req.body.userRole;
            if (userRole == "gost") {
                gost_1.default.findOne({ username: username }).then((korisnik) => __awaiter(this, void 0, void 0, function* () {
                    if (korisnik != null) {
                        const storedPassword = korisnik.password;
                        let passwordMatch = false;
                        if (storedPassword != null && (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$'))) {
                            passwordMatch = yield bcrypt.compare(password, storedPassword);
                        }
                        else {
                            passwordMatch = (password == storedPassword);
                        }
                        if (passwordMatch) {
                            if (korisnik.status == "odobren") {
                                res.json({ userType: 'gost', user: korisnik });
                            }
                            else if (korisnik.status == "neodobren") {
                                res.json({ userType: 'Korisnik nije odobren!', user: korisnik });
                            }
                            else {
                                res.json({ userType: 'Zahtev za registracijom korisnika je odbijen!', user: korisnik });
                            }
                        }
                        else {
                            res.json({ userType: 'Lozinka je pogresna!', user: null });
                        }
                    }
                    else {
                        res.json({ userType: 'Korisnik sa unetim username-om ne postoji', user: null });
                    }
                })).catch(err => {
                    console.log(err);
                });
            }
            else {
                konobar_1.default.findOne({ username: username }).then((korisnik) => __awaiter(this, void 0, void 0, function* () {
                    if (korisnik != null) {
                        const storedPassword = korisnik.password;
                        let passwordMatch = false;
                        if (storedPassword != null && (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$'))) {
                            passwordMatch = yield bcrypt.compare(password, storedPassword);
                        }
                        else {
                            passwordMatch = (password == storedPassword);
                        }
                        if (passwordMatch) {
                            res.json({ userType: 'konobar', user: korisnik });
                        }
                        else {
                            res.json({ userType: 'Lozinka je pogresna!', user: null });
                        }
                    }
                    else {
                        res.json({ userType: 'Korisnik sa unetim username-om ne postoji', user: null });
                    }
                })).catch(err => {
                    console.log(err);
                });
            }
        };
        this.login_admin = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            admin_1.default.findOne({ username: username, password: password }).then(kor => {
                if (kor == null) {
                    res.json({ message: "Korisnicko ime i/ili lozinka pogresni!", user: null });
                }
                else {
                    res.json({ message: "Uspesno", user: kor });
                }
            }).catch(err => {
                console.log(err);
            });
        };
        this.promenaLozinke = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            let newPassword = req.body.newPassword;
            gost_1.default.findOne({ username: username }).then((kor) => __awaiter(this, void 0, void 0, function* () {
                if (kor == null) {
                    konobar_1.default.findOne({ username: username }).then((kon) => __awaiter(this, void 0, void 0, function* () {
                        if (kon == null) {
                            res.json({ message: "Korisnik ne postoji!", user: null });
                        }
                        else {
                            const storedPassword = kon.password;
                            let passwordMatch = false;
                            if (storedPassword != null && (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$'))) {
                                passwordMatch = yield bcrypt.compare(password, storedPassword);
                            }
                            else {
                                passwordMatch = (password == storedPassword);
                            }
                            if (passwordMatch) { // ako se passwordi poklapaju
                                const hashedPassword = yield bcrypt.hash(newPassword, 10);
                                kon.password = hashedPassword;
                                kon.save();
                                res.json({ message: "Promenjena sifra", user: kon });
                            }
                            else { // ako se ne poklapaju
                                res.json({ message: "Stari password nije odgovarajuci!", user: null });
                            }
                        }
                    }));
                }
                else {
                    const storedPassword = kor.password;
                    let passwordMatch = false;
                    if (storedPassword != null && (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$'))) {
                        passwordMatch = yield bcrypt.compare(password, storedPassword);
                    }
                    else {
                        passwordMatch = (password == storedPassword);
                    }
                    if (passwordMatch) { // ako se passwordi poklapaju
                        const hashedPassword = yield bcrypt.hash(newPassword, 10);
                        kor.password = hashedPassword;
                        kor.save();
                        res.json({ message: "Promenjena sifra", user: kor });
                    }
                    else { // ako se passwordi ne poklapaju
                        res.json({ message: "Stari password nije odgovarajuci!", user: null });
                    }
                }
            })).catch(err => {
                console.log(err);
            });
        };
        this.dohvatanjeKorisnikaNaOsnovuUsername = (req, res) => {
            let username = req.body.username;
            gost_1.default.findOne({ username: username }).then(kor => {
                if (kor == null) {
                    konobar_1.default.findOne({ username: username }).then(kon => {
                        if (kon != null) {
                            res.json({ message: "Korisnik postoji", user: kon });
                        }
                        else {
                            res.json({ message: "Korisnik ne postoji!", user: null });
                        }
                    });
                }
                else {
                    res.json({ message: "Korisnik postoji", user: kor });
                }
            });
        };
        this.novaLozinka = (req, res) => {
            let username = req.body.username;
            let newPassword = req.body.newPassword;
            gost_1.default.findOne({ username: username }).then((kor) => __awaiter(this, void 0, void 0, function* () {
                if (kor == null) {
                    konobar_1.default.findOne({ username: username }).then((kon) => __awaiter(this, void 0, void 0, function* () {
                        if (kon == null) {
                            res.json({ message: "Korisnik ne postoji!", user: null });
                        }
                        else {
                            const hashedPassword = yield bcrypt.hash(newPassword, 10);
                            kon.password = hashedPassword;
                            kon.save();
                            res.json({ message: "Promenjena sifra", user: kon });
                        }
                    }));
                }
                else {
                    const hashedPassword = yield bcrypt.hash(newPassword, 10);
                    kor.password = hashedPassword;
                    kor.save();
                    res.json({ message: "Promenjena sifra", user: kor });
                }
            })).catch(err => {
                console.log(err);
            });
        };
        this.getNumberOfRegisteredGost = (req, res) => {
            gost_1.default.find({ status: "odobren" }).then(rez => {
                let numberOfGost = rez.length;
                res.json(numberOfGost);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getAllKonobari = (req, res) => {
            konobar_1.default.find({}).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
    }
    registerGost(req, res) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = req.body.username;
                const postoji = yield gost_1.default.findOne({ username: username });
                if (postoji) {
                    res.json("Korisnik vec postoji");
                    return resolve();
                }
                const postojiMail = yield gost_1.default.findOne({ email: req.body.email });
                if (postojiMail) {
                    res.json("Korisnik sa ovim mail-om vec postoji!");
                    return resolve();
                }
                const file = req.file;
                const filename = file ? file.originalname : null;
                const profilePictureUrl = filename || "placeholder.jpg";
                const hashedPassword = yield bcrypt.hash(req.body.password, 10);
                const user = new gost_2.default({
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
                yield user.save();
                res.json("Uspesno ste poslali zahtev za registracijom!");
                resolve();
            }
            catch (error) {
                console.log("Neuspeh");
                reject(error);
            }
        }));
    }
}
exports.UserController = UserController;
