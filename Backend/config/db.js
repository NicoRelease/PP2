const Database = require("better-sqlite3");
const path = require("path");
const chalk = require("chalk");
const dbPath = path.join(__dirname, "../data/database.sqlite");
const db = new Database(dbPath);

db.exec(`PRAGMA foreign_keys = ON;`);

db.exec(
  `
 CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  pais TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  sexo TEXT NOT NULL,
  sexo_opuesto TEXT NOT NULL,
  fecha_nac TEXT NOT NULL, 
  rol TEXT NOT NULL DEFAULT 'usuario',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER,
  endpoint TEXT,
  metodo TEXT,
  estado INTEGER,
  mensaje TEXT,
  categoria TEXT DEFAULT 'REQUEST',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`
);