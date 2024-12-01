// import { type SQLiteDatabase } from "expo-sqlite";
import { IQuestion } from "../../../store/question";
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseAsync("db.db").catch((e) => {
  console.error(e);
  throw e;
});

// export async function getFavorites(): Promise<IQuestion[]> {
//   const result = (await db).getAllAsync<IQuestion>("SELECT * FROM favorites");
//   return result;
// }

// export async function getFavorites(): Promise<IQuestion[]> {
//   const database = await initDatabase();
//   const result = await database.getAllAsync<IQuestion>(
//     "SELECT * FROM favorites"
//   );
//   return result;
// }

// export async function addFavorite(
//   db: SQLiteDatabase,
//   question: IQuestion
// ): Promise<void> {
//   await db.runAsync(
//     "INSERT OR IGNORE INTO favorites (questionId, name, category, spanish) VALUES (?, ?, ?, ?);",
//     question.id,
//     question.name,
//     question.category,
//     question.spanish
//   );
// }
// export async function addFavorite(question: IQuestion): Promise<void> {
//   const database = await initDatabase();
//   await database.runAsync(
//     "INSERT OR IGNORE INTO favorites (questionId, name, category, spanish) VALUES (?, ?, ?, ?);",
//     question.id,
//     question.name,
//     question.category,
//     question.spanish
//   );
// }

// export async function addFavorite(question: IQuestion): Promise<void> {
//   (await db).runSync(
//     "INSERT OR IGNORE INTO favorites (questionId, name, category, spanish) VALUES (?, ?, ?, ?);",
//     question.id,
//     question.name,
//     question.category,
//     question.spanish
//   );
// }

// export async function updateItemAsDoneAsync(
//   db: SQLiteDatabase,
//   question: IQuestion
// ): Promise<void> {
//   await db.runAsync(
//     "UPDATE favorites SET done = 1 WHERE questionId = ?;",
//     question.id
//   );
// }

export async function updateItemAsDoneAsync(
  question: IQuestion
): Promise<void> {
  (await db).runAsync(
    "UPDATE favorites SET done = 1 WHERE questionId = ?;",
    question.id
  );
}

// export async function removeFavorite(
//   db: SQLiteDatabase,
//   id: number
// ): Promise<void> {
//   await db.runAsync("DELETE FROM favorites WHERE questionId = ?;", id);
// }

export async function removeFavorite(id: number): Promise<void> {
  (await db).runAsync("DELETE FROM favorites WHERE questionId = ?;", id);
}

// export async function getFavorites(db: SQLiteDatabase): Promise<IQuestion[]> {
//   const result = await db.getAllAsync<IQuestion>(
//     "SELECT * FROM items WHERE done = ?",
//     false
//   );

//   return result;
// }

// export async function migrateDbIfNeeded(db: SQLiteDatabase) {
//   const DATABASE_VERSION = 1;
//   let currentDbVersion = 1;

//   if (currentDbVersion >= DATABASE_VERSION) {
//     return;
//   }

//   if (currentDbVersion === 0) {
//     await db.execAsync(`
//         CREATE TABLE IF NOT EXISTS favorites (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         questionId INTEGER UNIQUE,
//         name TEXT,
//         category TEXT,
//         spanish TEXT
//         `);
//     currentDbVersion = 1;
//   }
//   // if (currentDbVersion === 1) {
//   //   Add more migrations
//   // }
//   await db.execAsync("PRAGMA user_version = " + DATABASE_VERSION);
// }

export async function migrateDbIfNeeded(database: SQLite.SQLiteDatabase) {
  // const database = await initDatabase();
  const DATABASE_VERSION = 1;
  const result = await database.execAsync("PRAGMA user_version").catch((e) => {
    console.error(e);
    throw e;
  });
  const currentDbVersion = 0;

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    await database
      .execAsync(
        `
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        questionId INTEGER UNIQUE,
        name TEXT,
        category TEXT,
        spanish TEXT
      );
    `
      )
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }

  await database.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

// export async function migrateDbIfNeeded() {
//   const DATABASE_VERSION = 1;
//   let currentDbVersion = 1;

//   if (currentDbVersion >= DATABASE_VERSION) {
//     return;
//   }

//   if (currentDbVersion === 0) {
//     (await db).execAsync(`
//         CREATE TABLE IF NOT EXISTS favorites (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         questionId INTEGER UNIQUE,
//         name TEXT,
//         category TEXT,
//         spanish TEXT
//         `);
//   }

//   (await db)
//     .execAsync("PRAGMA user_version = " + DATABASE_VERSION)
//     .catch((e) => {
//       console.error(e);
//       throw e;
//     });
// }

// export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
export async function initDatabase() {
  // Abre la base de datos de forma sincrónica
  console.log("Opening database...");
  const db = SQLite.openDatabaseAsync("db.db").catch((e) => {
    console.error(e);
    throw e;
  });
  console.log({ db });

  // Ejecuta las migraciones necesarias
  migrateDbIfNeeded(await db);

  // return await db;
}
