import express from "express";
import { NarudzbinaController } from "../controllers/narudzbinaController";
import multer from "multer";
import * as fs from "fs";
const narudzbinaRouter = express.Router();
const narudzbinaController = new NarudzbinaController();

narudzbinaRouter.route("/generisiNovuNarudzbinu").post((req,res)=>narudzbinaController.generisiNovuNarudzbinu(req,res));

export default narudzbinaRouter;