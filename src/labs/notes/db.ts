import * as SQLite from 'expo-sqlite';

export type Note = {
  id: number;
  title: string;
  body: string;
  updated_at: number;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('notes.db').then(async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);
      return database;
    });
  }
  return databasePromise;
}

export async function listNotes() {
  const database = await getDatabase();
  return database.getAllAsync<Note>('SELECT id, title, body, updated_at FROM notes ORDER BY updated_at DESC');
}

export async function insertNote(title: string, body: string) {
  const database = await getDatabase();
  await database.runAsync('INSERT INTO notes (title, body, updated_at) VALUES (?, ?, ?)', title, body, Date.now());
}

export async function updateNote(id: number, title: string, body: string) {
  const database = await getDatabase();
  await database.runAsync('UPDATE notes SET title = ?, body = ?, updated_at = ? WHERE id = ?', title, body, Date.now(), id);
}

export async function deleteNote(id: number) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM notes WHERE id = ?', id);
}
