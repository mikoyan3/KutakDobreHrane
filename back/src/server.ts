import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import * as path from "path";
import restoranRouter from "./routers/restoranRouter";
import narudzbinaRouter from "./routers/narudzbinaRouter";
import rezervacijeRouter from "./routers/rezervacijeRouter";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect("mongodb://127.0.0.1:27017/kutakDobreHrane");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});



const router = express.Router();
router.use("/users", userRouter);
router.use("/restoran", restoranRouter);
router.use("/narudzbina", narudzbinaRouter);
router.use("/rezervacije", rezervacijeRouter);

app.use("/", router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
