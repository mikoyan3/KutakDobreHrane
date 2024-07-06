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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const userRouter = express_1.default.Router();
const userController = new userController_1.UserController();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) { //proverava da li postoji path uploadPath
            fs.mkdirSync(uploadPath, { recursive: true }); // ako ne postoji pravi ga
        }
        cb(null, uploadPath); // null znaci da nije bilo gresaka, a uploadPath je rezultat
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // null znaci da nije bilo gresaka, a uploadPath je rezultat
    }
});
const upload = (0, multer_1.default)({ storage: storage });
userRouter.route("/login").post((req, res) => userController.login(req, res));
userRouter.route("/login_admin").post((req, res) => userController.login_admin(req, res));
userRouter.route("/registerGost").post(upload.single('file'), userController.registerGost);
userRouter.route("/promenaLozinke").post(userController.promenaLozinke);
userRouter.route("/dohvatanjeKorisnikaNaOsnovuUsername").post(userController.dohvatanjeKorisnikaNaOsnovuUsername);
userRouter.route("/novaLozinka").post(userController.novaLozinka);
userRouter.route("/getNumberOfRegisteredGost").get((req, res) => userController.getNumberOfRegisteredGost(req, res));
userRouter.route("/getAllKonobari").get((req, res) => userController.getAllKonobari(req, res));
userRouter.route("/getFileGost").post((req, res) => userController.getFileGost(req, res));
userRouter.route("/getFileKonobar").post((req, res) => userController.getFileKonobar(req, res));
userRouter.route("/updateProfileGost/:username").put((req, res) => userController.updateProfileGost(req, res));
userRouter.route("/updatePictureGost").post(upload.single('file'), userController.updatePictureGost);
userRouter.route("/updatePictureKonobar").post(upload.single('file'), userController.updatePictureKonobar);
userRouter.route("/updateProfileKonobar/:username").put((req, res) => userController.updateProfileKonobar(req, res));
userRouter.route("/getInfoForStatistics").post(upload.single('file'), userController.getInfoForStatistics);
exports.default = userRouter;
