import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
// import { sqliteTable } from "drizzle-orm/sqlite-core";
 
export const todos = sqliteTable('todos', {
  text: text('text'),
});

const sqlite = new Database('sqlite.db');

export const db: BetterSQLite3Database = drizzle(sqlite); 
