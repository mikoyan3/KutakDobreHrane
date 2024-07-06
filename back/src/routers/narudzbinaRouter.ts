import express from "express";
import { NarudzbinaController } from "../controllers/narudzbinaController";
import multer from "multer";
import * as fs from "fs";
const narudzbinaRouter = express.Router();
const narudzbinaController = new NarudzbinaController();

narudzbinaRouter.route("/generisiNovuNarudzbinu").post((req,res)=>narudzbinaController.generisiNovuNarudzbinu(req,res));
narudzbinaRouter.route("/getNarudzbineForGost").post((req,res)=>narudzbinaController.getNarudzbineForGost(req,res));
narudzbinaRouter.route("/getTrenutneNarudzbine").post((req,res)=>narudzbinaController.getTrenutneNarudzbine(req,res));
narudzbinaRouter.route("/odbijNarudzbinu").post((req,res)=>narudzbinaController.odbijNarudzbinu(req,res));
narudzbinaRouter.route("/potvrdiNarudzbinu").post((req,res)=>narudzbinaController.potvrdiNarudzbinu(req,res));
narudzbinaRouter.route("/getJelo").post((req,res)=>narudzbinaController.getJelo(req,res));
export default narudzbinaRouter;