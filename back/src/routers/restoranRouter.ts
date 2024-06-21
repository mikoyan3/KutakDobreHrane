import express from "express";
import { RestoranController } from "../controllers/restoranController";
import multer from "multer";
import * as fs from "fs";
const restoranRouter = express.Router();
const restoranController = new RestoranController();


restoranRouter.route("/getNumberOfRestoran").get((req,res)=>restoranController.getNumberOfRestoran(req,res));
restoranRouter.route("/getReservationsLast24Hours").get((req,res)=>restoranController.getReservationsLast24Hours(req,res));
restoranRouter.route("/getReservationsLast7Days").get((req,res)=>restoranController.getReservationsLast7Days(req,res));
restoranRouter.route("/getReservationsLastMonth").get((req,res)=>restoranController.getReservationsLastMonth(req,res));
restoranRouter.route("/getAllRestorani").get((req,res)=>restoranController.getAllRestorani(req,res));
restoranRouter.route("/getAllRestoraniWithRatings").get((req,res)=>restoranController.getAllRestoraniWithRatings(req,res));
restoranRouter.route("/getRestoranWithNaziv").post((req,res)=>restoranController.getRestoranWithNaziv(req,res));
restoranRouter.route("/getRecenzijeForRestoran").post((req,res)=>restoranController.getRecenzijeForRestoran(req,res));
restoranRouter.route("/kreirajRezervaciju").post((req,res)=>restoranController.kreirajRezervaciju(req,res));
export default restoranRouter;