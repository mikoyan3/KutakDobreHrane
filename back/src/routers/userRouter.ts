import express from "express";
import { UserController } from "../controllers/userController";
import multer from "multer";
import * as fs from "fs";
const userRouter = express.Router();
const userController = new UserController();

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{ // req je Request objekat, file je trenutni file koji se obradjuje, cb je callback funkcija koja ce da se pozove kad se odredi destinacija fajlu
        const uploadPath = 'uploads/';

        if(!fs.existsSync(uploadPath)){ //proverava da li postoji path uploadPath
            fs.mkdirSync(uploadPath, {recursive: true}); // ako ne postoji pravi ga
        }
        cb(null, uploadPath); // null znaci da nije bilo gresaka, a uploadPath je rezultat
    },
    filename: (req, file, cb)=>{ // req i file isto kao gore, a cb je funkcija koja ce da se pozove kad se odredi filename.
        cb(null, file.originalname); // null znaci da nije bilo gresaka, a uploadPath je rezultat
    }
});

const upload = multer({ storage: storage });


userRouter.route("/login").post((req,res)=>userController.login(req,res));
userRouter.route("/login_admin").post((req,res)=>userController.login_admin(req,res));
userRouter.route("/registerGost").post(upload.single('file'), userController.registerGost);
userRouter.route("/promenaLozinke").post(userController.promenaLozinke);
userRouter.route("/dohvatanjeKorisnikaNaOsnovuUsername").post(userController.dohvatanjeKorisnikaNaOsnovuUsername);
userRouter.route("/novaLozinka").post(userController.novaLozinka);
userRouter.route("/getNumberOfRegisteredGost").get((req,res)=>userController.getNumberOfRegisteredGost(req,res));
userRouter.route("/getAllKonobari").get((req,res)=>userController.getAllKonobari(req,res));

export default userRouter;