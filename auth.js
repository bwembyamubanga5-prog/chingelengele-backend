import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./db.js";

const r = express.Router();

r.post("/register", async (req,res)=>{
  const { phone, password } = req.body;
  const hash = await bcrypt.hash(password,10);
  try{
    await db.run("INSERT INTO users(phone,password) VALUES(?,?)",[phone,hash]);
    res.json({success:true});
  }catch{ res.status(400).json({message:"User exists"}); }
});

r.post("/login", async (req,res)=>{
  const { phone, password } = req.body;
  const u = await db.get("SELECT * FROM users WHERE phone=?", [phone]);
  if(!u) return res.sendStatus(401);
  if(!await bcrypt.compare(password,u.password)) return res.sendStatus(401);
  const token = jwt.sign({id:u.id}, process.env.JWT_SECRET);
  res.json({token,balance:u.balance});
});

export default r;
