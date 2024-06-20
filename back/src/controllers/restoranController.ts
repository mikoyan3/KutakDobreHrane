import * as express from "express";
import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import Gost from "../models/gost"
import Konobar from "../models/konobar";
import Admin from "../models/admin"
import gost from "../models/gost";
import Restoran from "../models/restoran"
import Rezervacija from "../models/rezervacija"
const bcrypt = require('bcrypt');

export class RestoranController{
    getNumberOfRestoran = (req: express.Request, res: express.Response)=>{
        Restoran.find({}).then(rez=>{
            let numberOfRestoran = rez.length;
            res.json({count: numberOfRestoran});
        }).catch(err=>{
            console.log(err);
        })
    }

    getReservationsCount = (timeFrame, res) => {
      let startDate;
  
      switch (timeFrame) {
          case '24h':
              startDate = new Date();
              startDate.setHours(startDate.getHours() - 24);
              break;
          case '7d':
              startDate = new Date();
              startDate.setDate(startDate.getDate() - 7);
              break;
          case '1m':
              startDate = new Date();
              startDate.setMonth(startDate.getMonth() - 1);
              break;
          default:
              res.json({ error: 'Invalid time frame' });
              return;
      }

      Rezervacija.find({}).then(rezultati=>{
        let cnt = 0;
        rezultati.forEach(rez=>{
          if(rez.datum >= startDate) cnt++;
        })
        res.json({count: cnt});
      })
    };
  
    getReservationsLast24Hours = (req, res) => {
        this.getReservationsCount('24h', res);
    };
      
    getReservationsLast7Days = (req, res) => {
        this.getReservationsCount('7d', res);
    };
      
    getReservationsLastMonth = (req, res) => {
        this.getReservationsCount('1m', res);
    };
  

    getAllRestorani = (req, res) => {
        Restoran.find({}).then(restorani=>{
          res.json(restorani);
        }).catch(err=>{
            console.log(err);
        })
    }
}