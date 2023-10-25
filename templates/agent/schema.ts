import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

export const todos = sqliteTable('todos', {
  complete: integer('complete'),
  id: integer('id').primaryKey(),
  text: text('text')
});

const sqlite = new Database('sqlite.db');

export const db: BetterSQLite3Database = drizzle(sqlite); 
