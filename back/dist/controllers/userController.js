"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const gost_1 = __importDefault(require("../models/gost"));
const konobar_1 = __importDefault(require("../models/konobar"));
const admin_1 = __importDefault(require("../models/admin"));
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
const restoran_1 = __importDefault(require("../models/restoran"));
const gost_2 = __importDefault(require("../models/gost"));
const konobar_2 = __importDefault(require("../models/konobar"));
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
                            else if (korisnik.status == "odbijen") {
                                res.json({ userType: 'Zahtev za registracijom korisnika je odbijen!', user: korisnik });
                            }
                            else {
                                res.json({ userType: "Korisnik je deaktiviran", user: korisnik });
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
                            if (korisnik.status == "odobren") {
                                res.json({ userType: 'konobar', user: korisnik });
                            }
                            else {
                                res.json({ userType: "Korisnik je deaktiviran", user: korisnik });
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
        this.updatePictureGost = (req, res) => {
            const file = req.file;
            let filename = file.originalname;
            if (!file || !filename) {
                console.log("Neuspeh");
                return;
            }
            const URL = file.filename;
            gost_1.default.findOneAndUpdate({ username: req.body.username }, { $set: { pictureUrl: URL } }).then(resp => {
                res.json(resp);
            }).catch(err => {
                console.log(err);
            });
        };
        this.updatePictureKonobar = (req, res) => {
            const file = req.file;
            let filename = file.originalname;
            if (!file || !filename) {
                console.log("Neuspeh");
                return;
            }
            const URL = file.filename;
            konobar_1.default.findOneAndUpdate({ username: req.body.username }, { $set: { pictureUrl: URL } }).then(resp => {
                res.json(resp);
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
                        if (kon == null || kon.status != "odobren") {
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
                    if (kor.status == "odobren") {
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
                    else {
                        res.json({ message: "Korisnik nije jos uvek odobren", user: null });
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
                        if (kon == null || kon.status != "odobren") {
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
                    if (kor.status == "odobren") {
                        const hashedPassword = yield bcrypt.hash(newPassword, 10);
                        kor.password = hashedPassword;
                        kor.save();
                        res.json({ message: "Promenjena sifra", user: kor });
                    }
                    else {
                        res.json({ message: "Korisnik nije aktivan", user: null });
                    }
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
            konobar_1.default.find({ status: "odobren" }).then(rez => {
                res.json(rez);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getFileGost = (req, res) => {
            const directory = path.join(__dirname, "../../uploads");
            let username = req.body.username;
            gost_1.default.findOne({ username: username }).then(korisnik => {
                const filePath = path.join(directory, korisnik.pictureUrl);
                if (fs.existsSync(filePath)) {
                    res.type('application/octet-stream').sendFile(filePath);
                }
                else {
                    return;
                }
            });
        };
        this.getFileKonobar = (req, res) => {
            const directory = path.join(__dirname, "../../uploads");
            let username = req.body.username;
            konobar_1.default.findOne({ username: username }).then(korisnik => {
                const filePath = path.join(directory, korisnik.pictureUrl);
                if (fs.existsSync(filePath)) {
                    res.type('application/octet-stream').sendFile(filePath);
                }
                else {
                    return;
                }
            });
        };
        this.getInfoForStatistics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let konobar = req.body.konobar;
                let restoran = req.body.restoran;
                let rezervacije = yield rezervacija_1.default.find({ konobar: konobar });
                let weeklyGosti = {
                    'MON': 0,
                    'TUE': 0,
                    'WED': 0,
                    'THU': 0,
                    'FRI': 0,
                    'SAT': 0,
                    'SUN': 0
                };
                rezervacije.forEach(rez => {
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
                });
                let konobari = yield konobar_1.default.find({ restoran: req.body.restoran });
                let gostiPoKonobaru = {};
                konobari.forEach(kon => {
                    gostiPoKonobaru[kon.username] = 0;
                });
                let allRezervacije = yield rezervacija_1.default.find({ restoran: restoran });
                allRezervacije.forEach(rez => {
                    let username = rez.konobar;
                    let brojGostiju = rez.brojGostiju;
                    gostiPoKonobaru[username] += brojGostiju;
                });
                let formatedGostiPoKonobaru = Object.keys(gostiPoKonobaru).map(username => {
                    return { username: username, sumBrojGostiju: gostiPoKonobaru[username] };
                });
                let trenDatum = new Date();
                trenDatum.setHours(trenDatum.getHours() + 2);
                let dvegodine = new Date();
                dvegodine.setHours(dvegodine.getHours() + 2);
                dvegodine.setMonth(dvegodine.getMonth() - 24);
                let rezerv = yield rezervacija_1.default.find({ restoran: restoran });
                let rezervacijeZadnjeDveGodine = [];
                rezerv.forEach(rez => {
                    let datumrez = new Date(rez.datum);
                    if (datumrez >= dvegodine) {
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
                rezervacijeZadnjeDveGodine.forEach(rez => {
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
                });
                const konstantaZaDeljenje = 24 * 4.345;
                Object.keys(daniUNedelji).forEach(dan => {
                    daniAvg[dan] = daniUNedelji[dan] / konstantaZaDeljenje;
                });
                res.json({ dijagramKolona: weeklyGosti, dijagramPita: formatedGostiPoKonobaru, dijagramHistogram: daniAvg });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.fetchAllInfoAdministrator = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let konobari = yield konobar_1.default.find({ status: "odobren" });
                let odobreniGosti = yield gost_1.default.find({ status: "odobren" });
                let zahteviGosti = yield gost_1.default.find({ status: "neodobren" });
                let restorani = yield restoran_1.default.find({});
                res.json({ konobari: konobari, odobreniGosti: odobreniGosti, zahteviGosti: zahteviGosti, restorani: restorani });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.deaktivirajKorisnika = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let tip = req.body.tip;
                let korisnik = req.body.korisnik;
                if (tip == 'gost') {
                    let gost = yield gost_1.default.findOne({ username: korisnik });
                    gost.status = "deaktiviran";
                    yield gost.save();
                    res.json("Uspeh");
                }
                else {
                    let konobar = yield konobar_1.default.findOne({ username: korisnik });
                    konobar.status = "deaktiviran";
                    yield konobar.save();
                    res.json("Uspeh");
                }
            }
            catch (error) {
                console.log(error);
            }
        });
        this.prihvatiKorisnika = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let korisnik = req.body.korisnik;
                let gost = yield gost_1.default.findOne({ username: korisnik });
                gost.status = "odobren";
                yield gost.save();
                res.json("Uspeh");
            }
            catch (error) {
                console.log(error);
            }
        });
        this.odbijKorisnika = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let korisnik = req.body.korisnik;
                let gost = yield gost_1.default.findOne({ username: korisnik });
                gost.status = "odbijen";
                yield gost.save();
                res.json("Uspeh");
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    registerKonobar(req, res) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = req.body.username;
                const postojiKon = yield konobar_1.default.findOne({ username: username });
                const postojiGos = yield gost_1.default.findOne({ username: username });
                if (postojiKon || postojiGos) {
                    res.json("Korisnik vec postoji");
                    return resolve();
                }
                const postojiMailKon = yield konobar_1.default.findOne({ email: req.body.email });
                const postojiMailGos = yield gost_1.default.findOne({ email: req.body.email });
                if (postojiMailGos || postojiMailKon) {
                    res.json("Korisnik sa ovim mail-om vec postoji!");
                    return resolve();
                }
                const file = req.file;
                const filename = file ? file.originalname : null;
                const profilePictureUrl = filename || "placeholder.jpg";
                const hashedPassword = yield bcrypt.hash(req.body.password, 10);
                const user = new konobar_2.default({
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
    registerGost(req, res) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = req.body.username;
                const postojiKon = yield konobar_1.default.findOne({ username: username });
                const postojiGos = yield gost_1.default.findOne({ username: username });
                if (postojiKon || postojiGos) {
                    res.json("Korisnik vec postoji");
                    return resolve();
                }
                const postojiMailKon = yield konobar_1.default.findOne({ email: req.body.email });
                const postojiMailGos = yield gost_1.default.findOne({ email: req.body.email });
                if (postojiMailGos || postojiMailKon) {
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
    updateProfileGost(req, res) {
        let updatedProfile = req.body;
        let username = req.params.username;
        gost_1.default.findOneAndUpdate({ username: username }, updatedProfile, { new: true }).then(updatedUser => {
            res.json(updatedUser);
        }).catch(err => {
            console.log(err);
        });
    }
    updateProfileKonobar(req, res) {
        let updatedProfile = req.body;
        let username = req.params.username;
        konobar_1.default.findOneAndUpdate({ username: username }, updatedProfile, { new: true }).then(updatedUser => {
            res.json(updatedUser);
        }).catch(err => {
            console.log(err);
        });
    }
}
exports.UserController = UserController;
