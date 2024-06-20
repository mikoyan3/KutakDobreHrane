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
exports.RestoranController = void 0;
const restoran_1 = __importDefault(require("../models/restoran"));
const rezervacija_1 = __importDefault(require("../models/rezervacija"));
const recenzija_1 = __importDefault(require("../models/recenzija"));
const bcrypt = require('bcrypt');
class RestoranController {
    constructor() {
        this.getNumberOfRestoran = (req, res) => {
            restoran_1.default.find({}).then(rez => {
                let numberOfRestoran = rez.length;
                res.json({ count: numberOfRestoran });
            }).catch(err => {
                console.log(err);
            });
        };
        this.getReservationsCount = (timeFrame, res) => {
            let startDate;
            switch (timeFrame) {
                case '24h':
                    startDate = new Date();
                    startDate.setHours(startDate.getHours() - 22);
                    break;
                case '7d':
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 7);
                    startDate.setHours(startDate.getHours() + 2);
                    break;
                case '1m':
                    startDate = new Date();
                    startDate.setMonth(startDate.getMonth() - 1);
                    startDate.setHours(startDate.getHours() + 2);
                    break;
                default:
                    res.json({ error: 'Invalid time frame' });
                    return;
            }
            rezervacija_1.default.find({}).then(rezultati => {
                let cnt = 0;
                rezultati.forEach(rez => {
                    if (rez.datum >= startDate)
                        cnt++;
                });
                res.json({ count: cnt });
            });
        };
        this.getReservationsLast24Hours = (req, res) => {
            this.getReservationsCount('24h', res);
        };
        this.getReservationsLast7Days = (req, res) => {
            this.getReservationsCount('7d', res);
        };
        this.getReservationsLastMonth = (req, res) => {
            this.getReservationsCount('1m', res);
        };
        this.getAllRestorani = (req, res) => {
            restoran_1.default.find({}).then(restorani => {
                res.json(restorani);
            }).catch(err => {
                console.log(err);
            });
        };
        this.getAllRestoraniWithRatings = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ratings = yield recenzija_1.default.aggregate([{
                        $group: {
                            _id: "$restoran",
                            avgRating: { $avg: "$ocena" }
                        }
                    }]);
                const ratingsMap = {};
                ratings.forEach(rating => {
                    ratingsMap[rating._id] = rating.avgRating;
                });
                const restorani = yield restoran_1.default.find();
                const restoraniWithRatings = restorani.map(restoran => {
                    const restoranObject = restoran.toObject();
                    return Object.assign(Object.assign({}, restoranObject), { avgRating: ratingsMap[restoran.naziv] || 0 });
                });
                res.json(restoraniWithRatings);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.RestoranController = RestoranController;
