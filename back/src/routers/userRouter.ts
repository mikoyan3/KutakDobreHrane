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
userRouter.route("/getFileGost").post((req,res)=>userController.getFileGost(req, res));
userRouter.route("/getFileKonobar").post((req,res)=>userController.getFileKonobar(req, res));
userRouter.route("/updateProfileGost/:username").put((req,res)=>userController.updateProfileGost(req, res));
userRouter.route("/updatePictureGost").post(upload.single('file'), userController.updatePictureGost);
userRouter.route("/updatePictureKonobar").post(upload.single('file'), userController.updatePictureKonobar);
userRouter.route("/updateProfileKonobar/:username").put((req,res)=>userController.updateProfileKonobar(req, res));
userRouter.route("/getInfoForStatistics").post((req,res)=>userController.getInfoForStatistics(req, res));
userRouter.route("/registerKonobar").post(upload.single('file'), userController.registerKonobar);
userRouter.route("/fetchAllInfoAdministrator").get((req,res)=>userController.fetchAllInfoAdministrator(req,res));
userRouter.route("/deaktivirajKorisnika").post((req,res)=>userController.deaktivirajKorisnika(req, res));
userRouter.route("/prihvatiKorisnika").post((req,res)=>userController.prihvatiKorisnika(req, res));
userRouter.route("/odbijKorisnika").post((req,res)=>userController.odbijKorisnika(req, res));
export default userRouter;