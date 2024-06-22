import express from "express";
import { RezervacijeController } from "../controllers/rezervacijeController";
import multer from "multer";
import * as fs from "fs";
const rezervacijeRouter = express.Router();
const rezervacijeController = new RezervacijeController();


rezervacijeRouter.route("/getAktuelneRezervacije").post((req,res)=>rezervacijeController.getAktuelneRezervacije(req,res));
rezervacijeRouter.route("/getArhiviraneRezervacije").post((req,res)=>rezervacijeController.getArhiviraneRezervacije(req,res));
rezervacijeRouter.route("/otkaziRezervaciju").post((req,res)=>rezervacijeController.otkaziRezervaciju(req,res));
rezervacijeRouter.route("/ostaviRecenziju").post((req,res)=>rezervacijeController.ostaviRecenziju(req,res));
export default rezervacijeRouter;