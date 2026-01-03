import express from "express";
import jwt from "jsonwebtoken";
import db from "./db.js";

const r = express.Router();
const pattern = ["win","win","lose","win","lose","lose","lose"];
const sectors = [0,1,2,5,10];

r.post("/", async (req,res)=>{
  const token = req.headers.authorization?.split(" ")[1];
  if(!token) return res.sendStatus(401);
  const d = jwt.verify(token, process.env.JWT_SECRET);
  const u = await db.get("SELECT * FROM users WHERE id=?", [d.id]);

  const bet = req.body.bet;
  if(u.balance < bet) return res.status(400).json({message:"Low balance"});

  const c = await db.get("SELECT COUNT(*) c FROM spins WHERE user_id=?", [u.id]);
  const mode = pattern[c.c] || "random";
  const sector = mode==="win" ? sectors[Math.floor(Math.random()*sectors.length)] : 0;
  const win = bet * sector;

  await db.run("UPDATE users SET balance=balance-?+? WHERE id=?", [bet,win,u.id]);
  await db.run("INSERT INTO spins(user_id,bet,win,result) VALUES(?,?,?,?)",[u.id,bet,win,sector]);

  res.json({sector,win});
});

export default r;
