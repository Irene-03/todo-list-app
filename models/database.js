// ======================================================================
// SQLite Database Configuration and Schema
// ======================================================================

const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, '..', 'todos.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// ======================================================================
// CREATE TABLES
// ======================================================================

// Todos table
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    description TEXT,
    done INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'normal',
    important INTEGER DEFAULT 0,
    dueDate TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`);

// Groups/Directories table (for many-to-many relationship)
db.exec(`
  CREATE TABLE IF NOT EXISTS directories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL
  )
`);

// Junction table for todos and directories (many-to-many)
db.exec(`
  CREATE TABLE IF NOT EXISTS todo_directories (
    todoId INTEGER NOT NULL,
    directoryId INTEGER NOT NULL,
    PRIMARY KEY (todoId, directoryId),
    FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE,
    FOREIGN KEY (directoryId) REFERENCES directories(id) ON DELETE CASCADE
  )
`);

// ======================================================================
// PREPARED STATEMENTS (for better performance)
// ======================================================================

const statements = {
  // Todos
  getAllTodos: db.prepare(`
    SELECT * FROM todos ORDER BY createdAt DESC
  `),
  
  getTodoById: db.prepare(`
    SELECT * FROM todos WHERE id = ?
  `),
  
  createTodo: db.prepare(`
    INSERT INTO todos (text, description, done, priority, important, dueDate, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  updateTodo: db.prepare(`
    UPDATE todos 
    SET text = ?, description = ?, done = ?, priority = ?, important = ?, dueDate = ?, updatedAt = ?
    WHERE id = ?
  `),
  
  deleteTodo: db.prepare(`
    DELETE FROM todos WHERE id = ?
  `),
  
  // Directories
  getAllDirectories: db.prepare(`
    SELECT * FROM directories ORDER BY name ASC
  `),
  
  getDirectoryById: db.prepare(`
    SELECT * FROM directories WHERE id = ?
  `),
  
  getDirectoryByName: db.prepare(`
    SELECT * FROM directories WHERE name = ?
  `),
  
  createDirectory: db.prepare(`
    INSERT INTO directories (name, createdAt) VALUES (?, ?)
  `),
  
  updateDirectory: db.prepare(`
    UPDATE directories SET name = ? WHERE id = ?
  `),
  
  deleteDirectory: db.prepare(`
    DELETE FROM directories WHERE id = ?
  `),
  
  // Todo-Directory relationships
  linkTodoDirectory: db.prepare(`
    INSERT OR IGNORE INTO todo_directories (todoId, directoryId) VALUES (?, ?)
  `),
  
  unlinkTodoDirectory: db.prepare(`
    DELETE FROM todo_directories WHERE todoId = ? AND directoryId = ?
  `),
  
  unlinkAllTodoDirectories: db.prepare(`
    DELETE FROM todo_directories WHERE todoId = ?
  `),
  
  getTodoDirectories: db.prepare(`
    SELECT d.* FROM directories d
    INNER JOIN todo_directories td ON d.id = td.directoryId
    WHERE td.todoId = ?
  `),
  
  getDirectoryTodos: db.prepare(`
    SELECT t.* FROM todos t
    INNER JOIN todo_directories td ON t.id = td.todoId
    WHERE td.directoryId = ?
  `)
};

// ======================================================================
// HELPER FUNCTIONS
// ======================================================================

// Convert SQLite boolean (0/1) to JavaScript boolean
function toBool(val) {
  return val === 1;
}

// Convert JavaScript boolean to SQLite integer
function toInt(val) {
  return val ? 1 : 0;
}

// Get todo with its groups
function getTodoWithGroups(todoId) {
  const todo = statements.getTodoById.get(todoId);
  if (!todo) return null;
  
  const directories = statements.getTodoDirectories.all(todoId);
  
  return {
    ...todo,
    done: toBool(todo.done),
    important: toBool(todo.important),
    groups: directories.map(d => d.name)
  };
}

// Get all todos with their groups
function getAllTodosWithGroups() {
  const todos = statements.getAllTodos.all();
  
  return todos.map(todo => {
    const directories = statements.getTodoDirectories.all(todo.id);
    return {
      ...todo,
      done: toBool(todo.done),
      important: toBool(todo.important),
      groups: directories.map(d => d.name)
    };
  });
}

// ======================================================================
// EXPORTS
// ======================================================================

module.exports = {
  db,
  statements,
  toBool,
  toInt,
  getTodoWithGroups,
  getAllTodosWithGroups
};
