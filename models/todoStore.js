// ======================================================================
// Todo Store - SQLite Implementation
// ======================================================================

const { 
  statements, 
  toInt, 
  toBool, 
  getTodoWithGroups, 
  getAllTodosWithGroups 
} = require('./database');

// ======================================================================
// HELPER FUNCTIONS
// ======================================================================

function normalizeGroups(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(g => g.trim()).filter(Boolean);
  if (typeof input === "string") {
    return input
      .split(",")
      .map(g => g.trim())
      .filter(Boolean);
  }
  return [];
}

// Get or create directory by name
function getOrCreateDirectory(name) {
  let dir = statements.getDirectoryByName.get(name);
  if (!dir) {
    const now = new Date().toISOString();
    const result = statements.createDirectory.run(name, now);
    dir = statements.getDirectoryById.get(result.lastInsertRowid);
  }
  return dir;
}

// ======================================================================
// TODO OPERATIONS
// ======================================================================

function createTodo({ text, description, priority, dueDate, groups, important }) {
  const now = new Date().toISOString();
  
  // Insert todo
  const result = statements.createTodo.run(
    text.trim(),
    description?.trim() || "",
    0, // done = false
    priority || "normal",
    toInt(important || false),
    dueDate || null,
    now,
    now
  );
  
  const todoId = result.lastInsertRowid;
  
  // Link to directories/groups
  const groupNames = normalizeGroups(groups);
  for (const groupName of groupNames) {
    const dir = getOrCreateDirectory(groupName);
    statements.linkTodoDirectory.run(todoId, dir.id);
  }
  
  return getTodoWithGroups(todoId);
}

function getTodos({ status, search }) {
  let result = getAllTodosWithGroups();
  
  // Filter by status
  if (status === "completed") {
    result = result.filter(t => t.done);
  } else if (status === "active") {
    result = result.filter(t => !t.done);
  }
  
  // Filter by search
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      t =>
        t.text.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }
  
  // Sort by creation date
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return result;
}

function getById(id) {
  return getTodoWithGroups(Number(id));
}

function toggleDone(id) {
  const todo = getTodoWithGroups(Number(id));
  if (!todo) return null;
  
  const newDone = !todo.done;
  const now = new Date().toISOString();
  
  statements.updateTodo.run(
    todo.text,
    todo.description,
    toInt(newDone),
    todo.priority,
    toInt(todo.important),
    todo.dueDate,
    now,
    Number(id)
  );
  
  return getTodoWithGroups(Number(id));
}

function updateTodo(id, updates) {
  const todo = getTodoWithGroups(Number(id));
  if (!todo) return null;
  
  const now = new Date().toISOString();
  
  // Update basic fields
  statements.updateTodo.run(
    updates.text !== undefined ? updates.text.trim() : todo.text,
    updates.description !== undefined ? updates.description.trim() : todo.description,
    toInt(updates.done !== undefined ? updates.done : todo.done),
    updates.priority !== undefined ? updates.priority : todo.priority,
    toInt(updates.important !== undefined ? updates.important : todo.important),
    updates.dueDate !== undefined ? updates.dueDate : todo.dueDate,
    now,
    Number(id)
  );
  
  // Update groups if provided
  if (updates.groups !== undefined) {
    // Remove all existing links
    statements.unlinkAllTodoDirectories.run(Number(id));
    
    // Add new links
    const groupNames = normalizeGroups(updates.groups);
    for (const groupName of groupNames) {
      const dir = getOrCreateDirectory(groupName);
      statements.linkTodoDirectory.run(Number(id), dir.id);
    }
  }
  
  return getTodoWithGroups(Number(id));
}

function removeTodo(id) {
  const todo = getTodoWithGroups(Number(id));
  if (!todo) return false;
  
  statements.deleteTodo.run(Number(id));
  return true;
}

function clearCompleted() {
  const todos = getAllTodosWithGroups();
  const completed = todos.filter(t => t.done);
  
  for (const todo of completed) {
    statements.deleteTodo.run(todo.id);
  }
  
  return completed.length;
}

function getStats() {
  const todos = getAllTodosWithGroups();
  const total = todos.length;
  const completed = todos.filter(t => t.done).length;
  const active = total - completed;
  return { total, completed, active };
}

// ======================================================================
// EXPORTS
// ======================================================================

module.exports = {
  createTodo,
  getTodos,
  getById,
  toggleDone,
  updateTodo,
  removeTodo,
  clearCompleted,
  getStats
};
