import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db = await open({ filename:"database.db", driver:sqlite3.Database });

await db.exec(`
CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY,
 phone TEXT UNIQUE,
 password TEXT,
 balance REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS spins(
 id INTEGER PRIMARY KEY,
 user_id INTEGER,
 bet REAL,
 win REAL,
 result INTEGER,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;
