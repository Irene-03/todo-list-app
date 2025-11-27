// ======================================================================
// TODO APP — Full JS Controller for Dashboard (Complete Enhanced Version)
// ======================================================================

const API_BASE = "/api/todos";
const APP_API_KEY = (window.APP_CONFIG && window.APP_CONFIG.apiKey) || "";

// ======================================================================
// JWT AUTHENTICATION
// ======================================================================
function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function getUser() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/auth.html';
}

function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = '/auth.html';
        return false;
    }
    return true;
}

// API helper with JWT
async function apiRequest(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (APP_API_KEY) {
      headers['X-API-KEY'] = APP_API_KEY;
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
    }
    
    return response;
}

// Current filters
let currentCategory = "today";
let currentStatus = "all";
let currentSearch = "";

// Directories (groups created by user)
let directories = [];
let selectedDirectory = null;

// Required for calendar
let currentCalendarYear;
let currentCalendarMonth;
let selectedCalendarDate;
let selectedFilterDate = null; // For "Selected Date" category

// Weather location
let weatherLocation = "London, UK";
let weatherData = null;

// Bulk delete mode
let bulkDeleteMode = false;
let selectedTasks = new Set();

// Task highlight
let highlightedTaskId = null;

// View mode (list or grid)
let viewMode = "list";

// Sort mode
let sortMode = "date"; // date, priority, title

// Edit modal
let editingTaskId = null;

// ================================================================
// COLLECT DOM REFERENCES
// ================================================================
const el = {
  newTodo: document.getElementById("newTodo"),
  priority: document.getElementById("priority"),
  addBtn: document.getElementById("addBtn"),
  todoList: document.getElementById("todoList"),
  searchInput: document.getElementById("search-task-input"),
  clearCompleted: document.getElementById("clearCompleted"),
  message: document.getElementById("message"),
  listTitle: document.getElementById("list-title"),
  listSubtitle: document.getElementById("list-subtitle"),
  topProgressFill: document.getElementById("top-progress-fill"),
  topProgressCount: document.getElementById("top-progress-count"),
  topProgressTitle: document.getElementById("top-progress-title"),
  sideNavItems: document.querySelectorAll(".side-nav-item"),

  // Directories
  dirList: document.getElementById("dir-list"),
  dirNewBtn: document.getElementById("dir-new-btn"),
  directoriesHeader: document.getElementById("directories-header"),
  directoriesContainer: document.getElementById("directories-container"),

  // Modal
  modalOverlay: document.getElementById("task-modal-overlay"),
  modalForm: document.getElementById("task-modal-form"),
  modalTitle: document.getElementById("modal-title"),
  modalDesc: document.getElementById("modal-desc"),
  modalDate: document.getElementById("modal-date"),
  modalPriority: document.getElementById("modal-priority"),
  modalImportant: document.getElementById("modal-important"),

  sidebarNewTask: document.getElementById("sidebar-new-task-btn"),
  topNewTask: document.getElementById("top-new-task-btn"),

  groupSelect: document.getElementById("group-select-area"),
  modalNewGroupInput: document.getElementById("modal-new-group-input"),
  modalNewGroupBtn: document.getElementById("modal-new-group-btn"),

  modalClose: document.getElementById("task-modal-close"),
  modalCancel: document.getElementById("task-modal-cancel")
};

// Weather + calendar references
const weatherEl = {
  dayLabel: document.getElementById("weather-day-label"),
  time: document.getElementById("weather-time"),
  dateSmall: document.getElementById("weather-date-small"),
  temp: document.getElementById("weather-temp"),
  location: document.getElementById("weather-location"),
  snow: document.getElementById("weather-snow"),
  humidity: document.getElementById("weather-humidity"),
  status: document.getElementById("weather-status"),
  iconDiv: document.querySelector(".weather-icon"),
  card: document.getElementById("weather-card"),
  closeBtn: document.getElementById("weather-close-btn")
};

const calendarEl = {
  monthLabel: document.getElementById("calendar-month-label"),
  grid: document.getElementById("calendar-grid"),
  prevBtn: document.getElementById("calendar-prev"),
  nextBtn: document.getElementById("calendar-next")
};

// ================================================================
// HELPERS
// ================================================================

function showMessage(text, type = "error") {
  el.message.textContent = text;
  el.message.classList.remove("hidden", "success", "error");
  el.message.classList.add(type === "success" ? "success" : "error");

  // Auto-hide both success and error messages
  setTimeout(() => el.message.classList.add("hidden"), 3000);
}

function normalizeApiResponse(payload) {
  let current = payload;
  let depth = 0;

  while (
    current &&
    typeof current === "object" &&
    !Array.isArray(current) &&
    Object.prototype.hasOwnProperty.call(current, "success") &&
    Object.prototype.hasOwnProperty.call(current, "data") &&
    depth < 5
  ) {
    current = current.data;
    depth += 1;
  }

  return current;
}

function ensureTodoArray(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && Array.isArray(payload.todos)) {
    return payload.todos;
  }
  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }
  return [];
}

async function fetchJSON(url, options = {}) {
  const token = getToken();
  
  console.log('📡 fetchJSON called');
  console.log('URL:', url);
  console.log('Token:', token ? 'EXISTS' : 'NULL');
  
  if (!token) {
    console.log('❌ No token in fetchJSON');
    window.location.href = '/auth.html';
    throw new Error('Authentication required');
  }
  
  console.log('✅ Sending request with token:', token.substring(0, 30) + '...');
  
  const headers = { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
  if (APP_API_KEY) {
    headers['X-API-KEY'] = APP_API_KEY;
  }
  
  console.log('Headers:', JSON.stringify(headers));
  
  const res = await fetch(url, {
    headers,
    ...options
  });
  
  console.log('Response status:', res.status);

  if (res.status === 401) {
    logout();
    return;
  }

  if (!res.ok) {
    try {
      const errorData = await res.json();
      // Handle new error format from Phase 2
      if (errorData.error && errorData.error.message) {
        throw new Error(errorData.error.message);
      }
      throw new Error(errorData.error || "Request failed");
    } catch (err) {
      if (err.message && err.message !== "Request failed") {
        throw err;
      }
      throw new Error("Request failed");
    }
  }

  if (res.status === 204) return null;

  const jsonData = await res.json();
  const normalized = normalizeApiResponse(jsonData);

  // Handle new response format from Phase 2 (with formatResponse middleware)
  if (normalized !== undefined) {
    return normalized;
  }
  
  // Fallback for old format or direct data
  return jsonData;
}

// ================================================================
// BULK DELETE MODE
// ================================================================

function enterBulkDeleteMode() {
  bulkDeleteMode = true;
  selectedTasks.clear();
  highlightedTaskId = null;
  
  // Show bulk actions bar
  const bulkBar = document.getElementById("bulk-actions-bar");
  if (bulkBar) {
    bulkBar.classList.remove("hidden");
  }
  
  // Update UI
  renderCurrentView();
}

function exitBulkDeleteMode() {
  bulkDeleteMode = false;
  selectedTasks.clear();
  
  // Hide bulk actions bar
  const bulkBar = document.getElementById("bulk-actions-bar");
  if (bulkBar) {
    bulkBar.classList.add("hidden");
  }
  
  // Update UI
  renderCurrentView();
}

function toggleTaskSelection(taskId) {
  if (selectedTasks.has(taskId)) {
    selectedTasks.delete(taskId);
  } else {
    selectedTasks.add(taskId);
  }
  updateBulkActionsBar();
  renderCurrentView();
}

function updateBulkActionsBar() {
  const countEl = document.getElementById("bulk-selected-count");
  if (countEl) {
    countEl.textContent = `${selectedTasks.size} selected`;
  }
}

async function deleteSelectedTasks() {
  if (selectedTasks.size === 0) return;
  
  const confirmed = confirm(`Are you sure you want to delete ${selectedTasks.size} task(s)? This action cannot be undone.`);
  if (!confirmed) return;
  
  try {
    const promises = Array.from(selectedTasks).map(id => 
      fetchJSON(`${API_BASE}/${id}`, { method: "DELETE" })
    );
    await Promise.all(promises);
    
    showMessage(`${selectedTasks.size} tasks deleted successfully`, "success");
    selectedTasks.clear();
    exitBulkDeleteMode();
    await loadTodos();
  } catch (err) {
    showMessage("Error deleting tasks: " + err.message, "error");
  }
}

// ================================================================
// GROUP (DIRECTORY) MANAGEMENT
// ================================================================

// Persistent directories storage
const persistentDirectories = new Set();

// Extract all unique groups from todos
function updateDirectoriesFromTodos(allTodos) {
  const extracted = new Set(persistentDirectories);
  allTodos.forEach(t => {
    if (t.groups && Array.isArray(t.groups)) {
      t.groups.forEach(g => extracted.add(g));
    }
  });
  directories = Array.from(extracted).sort();
  renderDirectories();
}

// Directory clicked
function selectDirectory(name) {
  selectedDirectory = name;
  currentCategory = null;
  
  document.querySelectorAll(".side-nav-item").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".dir-item").forEach(btn => {
    if (btn.textContent === name) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  loadTodos();
}

// Make directory editable (double click)
function makeDirectoryEditable(btn, oldName) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "dir-input";
  input.value = oldName;
  btn.replaceWith(input);
  input.focus();
  input.select();

  async function finishEdit() {
    const newName = input.value.trim();
    if (!newName || newName === oldName) {
      renderDirectories();
      return;
    }

    try {
      const todosResponse = await fetchJSON(API_BASE);
      const todos = ensureTodoArray(todosResponse);
      const promises = todos
        .filter(t => t.groups && t.groups.includes(oldName))
        .map(t => {
          const newGroups = t.groups.map(g => (g === oldName ? newName : g));
          return fetchJSON(`${API_BASE}/${t.id}`, {
            method: "PUT",
            body: JSON.stringify({ groups: newGroups })
          });
        });

      await Promise.all(promises);
      await loadTodos();
    } catch (err) {
      showMessage("Error renaming directory: " + err.message, "error");
    }
  }

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") finishEdit();
    if (e.key === "Escape") renderDirectories();
  });
}

// Render directories inside side bar
function renderDirectories() {
  el.dirList.innerHTML = "";
  directories.forEach(name => {
    const dirContainer = document.createElement("div");
    dirContainer.className = "dir-item-container";
    
    const btn = document.createElement("button");
    btn.className = "dir-item";
    btn.textContent = name;
    if (selectedDirectory === name) btn.classList.add("active");

    btn.addEventListener("click", () => selectDirectory(name));
    btn.addEventListener("dblclick", () => makeDirectoryEditable(btn, name));
    
    // Delete button for directory
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "dir-delete-btn";
    deleteBtn.innerHTML = "×";
    deleteBtn.title = "Delete directory";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteDirectory(name);
    });

    dirContainer.appendChild(btn);
    dirContainer.appendChild(deleteBtn);
    el.dirList.appendChild(dirContainer);
  });
}

// Open input to create new directory
function createNewDirectory() {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "dir-input";
  input.placeholder = "Enter directory name...";
  el.dirList.appendChild(input);
  input.focus();

  async function submit() {
    const name = input.value.trim();
    if (!name) {
      input.remove();
      return;
    }
    if (directories.includes(name)) {
      showMessage("Directory already exists", "error");
      input.remove();
      return;
    }
    persistentDirectories.add(name);
    directories.push(name);
    directories.sort();
    renderDirectories();
    showMessage(`Directory "${name}" created`, "success");
  }

  input.addEventListener("blur", submit);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") input.remove();
  });
}

// Delete directory
async function deleteDirectory(name) {
  const confirmed = confirm(`Are you sure you want to delete the directory "${name}"? Tasks in this directory will not be deleted, only the directory label.`);
  if (!confirmed) return;
  
  persistentDirectories.delete(name);
  directories = directories.filter(d => d !== name);
  
  if (selectedDirectory === name) {
    selectedDirectory = null;
    currentCategory = "all";
  }
  
  renderDirectories();
  await loadTodos();
  showMessage(`Directory "${name}" deleted`, "success");
}

function toggleDirectoriesCollapse() {
  el.directoriesContainer.classList.toggle("collapsed");
  const chevron = el.directoriesHeader.querySelector(".chevron");
  chevron.textContent = el.directoriesContainer.classList.contains("collapsed") ? "›" : "⌄";
}

// ================================================================
// SORTING
// ================================================================

function sortTodos(todos) {
  const sorted = [...todos];
  
  if (sortMode === "priority") {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    sorted.sort((a, b) => {
      const orderA = priorityOrder[a.priority] ?? 1;
      const orderB = priorityOrder[b.priority] ?? 1;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else if (sortMode === "date") {
    sorted.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } else if (sortMode === "title") {
    sorted.sort((a, b) => a.text.localeCompare(b.text));
  }
  
  return sorted;
}

function setSortMode(mode) {
  sortMode = mode;
  
  const sortBtn = document.getElementById("sort-btn");
  const sortMenu = document.getElementById("sort-menu");
  
  if (sortBtn) {
    const icons = { date: "📅", priority: "⭐", title: "🔤" };
    const labels = { date: "Date", priority: "Priority", title: "Title" };
    sortBtn.textContent = `${icons[sortMode]} Sort by: ${labels[sortMode]}`;
  }
  
  // Update active state in menu
  document.querySelectorAll(".sort-option").forEach(opt => {
    if (opt.dataset.sort === mode) {
      opt.classList.add("active");
    } else {
      opt.classList.remove("active");
    }
  });
  
  if (sortMenu) {
    sortMenu.classList.add("hidden");
  }
  
  renderCurrentView();
}

function toggleSortMenu() {
  const sortMenu = document.getElementById("sort-menu");
  if (sortMenu) {
    sortMenu.classList.toggle("hidden");
  }
}

// Close sort menu when clicking outside
document.addEventListener("click", (e) => {
  const sortDropdown = document.querySelector(".sort-dropdown");
  const sortMenu = document.getElementById("sort-menu");
  
  if (sortDropdown && sortMenu && !sortDropdown.contains(e.target)) {
    sortMenu.classList.add("hidden");
  }
});

// ================================================================
// VIEW MODE
// ================================================================

function toggleViewMode() {
  viewMode = viewMode === "list" ? "grid" : "list";
  el.todoList.classList.toggle("grid-view", viewMode === "grid");
  
  // Update view toggle buttons
  const viewBtns = document.querySelectorAll(".view-toggle .icon-btn");
  viewBtns.forEach((btn, idx) => {
    if (idx === 0 && viewMode === "list") btn.classList.add("active");
    else if (idx === 1 && viewMode === "grid") btn.classList.add("active");
    else btn.classList.remove("active");
  });
  
  renderCurrentView();
}

// ================================================================
// TODOS LOADING AND RENDER
// ================================================================

async function loadTodos() {
  try {
    let todosResponse = await fetchJSON(API_BASE);
    let todos = ensureTodoArray(todosResponse);

    // Apply directory filter
    if (selectedDirectory) {
      todos = todos.filter(t => t.groups && t.groups.includes(selectedDirectory));
    }

    // Apply category filter
    if (currentCategory === "today") {
      const today = new Date().toISOString().split("T")[0];
      todos = todos.filter(t => t.dueDate && t.dueDate.startsWith(today));
    } else if (currentCategory === "important") {
      todos = todos.filter(t => t.important === true);
    } else if (currentCategory === "completed") {
      todos = todos.filter(t => t.done === true);
    } else if (currentCategory === "uncompleted") {
      todos = todos.filter(t => t.done === false);
    } else if (currentCategory === "selected-date" && selectedFilterDate) {
      // Fix timezone issue - get local date string
      const year = selectedFilterDate.getFullYear();
      const month = String(selectedFilterDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedFilterDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      todos = todos.filter(t => t.dueDate && t.dueDate.startsWith(dateStr));
    }

    // Apply search filter
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      todos = todos.filter(
        t =>
          t.text.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Update directories from all todos
    const allTodosResponse = await fetchJSON(API_BASE);
    updateDirectoriesFromTodos(ensureTodoArray(allTodosResponse));

    // Update title and progress
    updateTitleAndProgress(todos);

    // Sort and render
    const sorted = sortTodos(todos);
    renderTodos(sorted);
    await loadStats();
  } catch (err) {
    showMessage("Error loading todos: " + err.message, "error");
  }
}

function updateTitleAndProgress(todos) {
  let title = "All tasks";
  
  if (selectedDirectory) {
    title = selectedDirectory;
  } else if (currentCategory === "today") {
    title = "Today's tasks";
  } else if (currentCategory === "important") {
    title = "Important tasks";
  } else if (currentCategory === "completed") {
    title = "Completed tasks";
  } else if (currentCategory === "uncompleted") {
    title = "Uncompleted tasks";
  } else if (currentCategory === "selected-date" && selectedFilterDate) {
    title = `Tasks for ${selectedFilterDate.toLocaleDateString()}`;
  }
  
  el.listTitle.textContent = title;
  if (el.topProgressTitle) {
    el.topProgressTitle.textContent = title;
  }
  
  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  
  el.listSubtitle.textContent = `(${total} tasks)`;
  el.topProgressCount.textContent = `${done}/${total}`;
  
  const percentage = total > 0 ? (done / total) * 100 : 0;
  el.topProgressFill.style.width = `${percentage}%`;
}

function renderCurrentView() {
  loadTodos();
}

function renderTodos(todos) {
  el.todoList.innerHTML = "";
  
  if (todos.length === 0) {
    el.todoList.innerHTML = '<li class="empty-state">No tasks to display</li>';
    return;
  }

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = todo.id;
    
    if (highlightedTaskId === todo.id && !bulkDeleteMode) {
      li.classList.add("highlighted");
    }
    
    if (selectedTasks.has(todo.id)) {
      li.classList.add("selected");
    }

    // Main content
    const mainDiv = document.createElement("div");
    mainDiv.className = "todo-main";

    // Bulk delete checkbox OR regular checkbox
    if (bulkDeleteMode) {
      const bulkCheck = document.createElement("input");
      bulkCheck.type = "checkbox";
      bulkCheck.className = "bulk-checkbox";
      bulkCheck.checked = selectedTasks.has(todo.id);
      bulkCheck.addEventListener("click", e => {
        e.stopPropagation();
        toggleTaskSelection(todo.id);
      });
      mainDiv.appendChild(bulkCheck);
    } else {
      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "todo-checkbox";
      check.checked = todo.done;
      check.addEventListener("click", e => {
        e.stopPropagation();
        toggleTodo(todo.id);
      });
      mainDiv.appendChild(check);
    }

    // Text block
    const textBlock = document.createElement("div");
    textBlock.className = "todo-text-block";

    // Groups
    if (todo.groups && todo.groups.length > 0) {
      const groupsDiv = document.createElement("div");
      groupsDiv.className = "group-tags";
      todo.groups.forEach(g => {
        const tag = document.createElement("span");
        tag.className = "group-tag";
        tag.textContent = g;
        groupsDiv.appendChild(tag);
      });
      textBlock.appendChild(groupsDiv);
    }

    // Title
    const titleDiv = document.createElement("div");
    titleDiv.className = "task-title";
    if (todo.done) titleDiv.classList.add("done");
    titleDiv.textContent = todo.text;
    textBlock.appendChild(titleDiv);

    // Description
    if (todo.description) {
      const descDiv = document.createElement("div");
      descDiv.className = "task-desc";
      descDiv.textContent = todo.description;
      textBlock.appendChild(descDiv);
    }

    mainDiv.appendChild(textBlock);
    li.appendChild(mainDiv);

    // Right side actions
    const rightDiv = document.createElement("div");
    rightDiv.className = "todo-actions";

    // Priority label
    if (todo.priority && todo.priority !== "normal") {
      const priorityLabel = document.createElement("span");
      priorityLabel.className = `list-label priority-${todo.priority}`;
      priorityLabel.textContent = todo.priority;
      rightDiv.appendChild(priorityLabel);
    }

    // Due date
    if (todo.dueDate) {
      const dateLabel = document.createElement("span");
      dateLabel.className = "list-label date-label";
      dateLabel.textContent = new Date(todo.dueDate).toLocaleDateString();
      rightDiv.appendChild(dateLabel);
    }

    // Important star
    const starBtn = document.createElement("button");
    starBtn.className = "icon-btn star-btn";
    starBtn.textContent = todo.important ? "⭐" : "☆";
    starBtn.title = "Toggle Important";
    starBtn.addEventListener("click", e => {
      e.stopPropagation();
      toggleImportant(todo);
    });
    rightDiv.appendChild(starBtn);

    // Three-dot menu button
    const menuBtn = document.createElement("button");
    menuBtn.className = "icon-btn menu-btn";
    menuBtn.textContent = "⋮";
    menuBtn.title = "Edit Task";
    menuBtn.addEventListener("click", e => {
      e.stopPropagation();
      openEditModal(todo);
    });
    rightDiv.appendChild(menuBtn);

    li.appendChild(rightDiv);

    // Click to highlight (only in normal mode)
    if (!bulkDeleteMode) {
      li.addEventListener("click", e => {
        if (e.target.closest(".todo-checkbox") || 
            e.target.closest(".icon-btn")) {
          return;
        }
        
        if (highlightedTaskId === todo.id) {
          highlightedTaskId = null;
        } else {
          highlightedTaskId = todo.id;
        }
        renderCurrentView();
      });
    }

    el.todoList.appendChild(li);
  });
}

async function loadStats() {
  try {
    const stats = await fetchJSON(`${API_BASE}/stats`);
    // Stats can be used if needed
  } catch (err) {
    console.error("Error loading stats:", err);
  }
}

// ================================================================
// ADD / UPDATE / DELETE TODO
// ================================================================

async function addFastTodo() {
  const text = el.newTodo.value.trim();
  if (!text) return;

  const priority = el.priority.value;
  
  // Determine groups based on current view
  let groups = [];
  if (selectedDirectory) {
    groups = [selectedDirectory];
  } else if (currentCategory && currentCategory !== "all" && currentCategory !== "today" && currentCategory !== "selected-date") {
    // Don't add group for "all tasks", "today", or "selected-date"
    // For other categories, the group can be added if needed
  }

  try {
    await fetchJSON(API_BASE, {
      method: "POST",
      body: JSON.stringify({ text, priority, groups })
    });

    el.newTodo.value = "";
    el.priority.value = "normal";
    showMessage("Task added successfully", "success");
    await loadTodos();
  } catch (err) {
    showMessage("Error adding task: " + err.message, "error");
  }
}

async function toggleTodo(id) {
  try {
    await fetchJSON(`${API_BASE}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ action: "toggle" })
    });
    await loadTodos();
  } catch (err) {
    showMessage("Error toggling task: " + err.message, "error");
  }
}

async function deleteTodo(id) {
  const confirmed = confirm("Are you sure you want to delete this task? This action cannot be undone.");
  if (!confirmed) return;
  
  try {
    await fetchJSON(`${API_BASE}/${id}`, { method: "DELETE" });
    showMessage("Task deleted successfully", "success");
    await loadTodos();
  } catch (err) {
    showMessage("Error deleting task: " + err.message, "error");
  }
}

async function clearCompleted() {
  const confirmed = confirm("Are you sure you want to delete all completed tasks? This action cannot be undone.");
  if (!confirmed) return;
  
  try {
    await fetchJSON(API_BASE, { method: "DELETE" });
    showMessage("Completed tasks cleared", "success");
    await loadTodos();
  } catch (err) {
    showMessage("Error clearing completed: " + err.message, "error");
  }
}

async function toggleImportant(todo) {
  try {
    await fetchJSON(`${API_BASE}/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({ important: !todo.important })
    });
    await loadTodos();
  } catch (err) {
    showMessage("Error toggling important: " + err.message, "error");
  }
}

// ================================================================
// MODAL — NEW TASK (FULL FEATURES)
// ================================================================

// Render group cards (B1)
function renderModalGroups(selected = []) {
  el.groupSelect.innerHTML = "";
  
  directories.forEach(groupName => {
    const card = document.createElement("div");
    card.className = "group-card";
    if (selected.includes(groupName)) {
      card.classList.add("selected");
    }
    
    const checkmark = document.createElement("span");
    checkmark.className = "checkmark";
    checkmark.textContent = selected.includes(groupName) ? "✓" : "";
    
    const label = document.createElement("span");
    label.textContent = groupName;
    
    card.appendChild(checkmark);
    card.appendChild(label);
    
    card.addEventListener("click", () => {
      const idx = modalSelectedGroups.indexOf(groupName);
      if (idx > -1) {
        modalSelectedGroups.splice(idx, 1);
      } else {
        modalSelectedGroups.push(groupName);
      }
      renderModalGroups(modalSelectedGroups);
    });
    
    el.groupSelect.appendChild(card);
  });
}

let modalSelectedGroups = []; // Holds selected groups inside modal

function openModal() {
  editingTaskId = null;
  modalSelectedGroups = selectedDirectory ? [selectedDirectory] : [];
  
  el.modalTitle.value = "";
  el.modalDesc.value = "";
  el.modalDate.value = "";
  el.modalPriority.value = "normal";
  el.modalImportant.checked = false;
  
  renderModalGroups(modalSelectedGroups);
  
  // Change modal header
  const modalHeader = el.modalOverlay.querySelector(".modal-header h3");
  if (modalHeader) modalHeader.textContent = "New Task";
  
  // Change submit button text
  const submitBtn = el.modalForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = "Add task";
  
  el.modalOverlay.classList.remove("hidden");
}

function openEditModal(todo) {
  editingTaskId = todo.id;
  modalSelectedGroups = todo.groups ? [...todo.groups] : [];
  
  el.modalTitle.value = todo.text || "";
  el.modalDesc.value = todo.description || "";
  el.modalDate.value = todo.dueDate || "";
  el.modalPriority.value = todo.priority || "normal";
  el.modalImportant.checked = todo.important || false;
  
  renderModalGroups(modalSelectedGroups);
  
  // Change modal header
  const modalHeader = el.modalOverlay.querySelector(".modal-header h3");
  if (modalHeader) modalHeader.textContent = "Edit Task";
  
  // Change submit button text
  const submitBtn = el.modalForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = "Save changes";
  
  el.modalOverlay.classList.remove("hidden");
}

function closeModal() {
  el.modalOverlay.classList.add("hidden");
  editingTaskId = null;
}

async function submitModal(e) {
  e.preventDefault();
  
  const text = el.modalTitle.value.trim();
  if (!text) {
    showMessage("Task title is required", "error");
    return;
  }
  
  const data = {
    text,
    description: el.modalDesc.value.trim(),
    dueDate: el.modalDate.value || null,
    priority: el.modalPriority.value,
    important: el.modalImportant.checked,
    groups: modalSelectedGroups
  };
  
  try {
    if (editingTaskId) {
      // Update existing task
      await fetchJSON(`${API_BASE}/${editingTaskId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
      showMessage("Task updated successfully", "success");
    } else {
      // Create new task
      await fetchJSON(API_BASE, {
        method: "POST",
        body: JSON.stringify(data)
      });
      showMessage("Task added successfully", "success");
    }
    
    closeModal();
    await loadTodos();
  } catch (err) {
    showMessage("Error saving task: " + err.message, "error");
  }
}

// Create new group inside modal
function modalCreateGroup() {
  const groupName = el.modalNewGroupInput.value.trim();
  if (!groupName) return;
  
  if (directories.includes(groupName)) {
    showMessage("Group already exists", "error");
    return;
  }
  
  directories.push(groupName);
  directories.sort();
  modalSelectedGroups.push(groupName);
  
  el.modalNewGroupInput.value = "";
  renderModalGroups(modalSelectedGroups);
  renderDirectories();
}

// ================================================================
// WEATHER + CALENDAR
// ================================================================

function calculateWeatherForDate(dateObj) {
  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  
  const temp = 10 + ((day + month * 3) % 20);
  const snow = (day * 7) % 100;
  const humidity = 60 + ((day * 3) % 30);
  
  const conditions = ["Sunny", "Partly cloudy", "Cloudy", "Rainy", "Stormy"];
  const status = conditions[(day + month) % conditions.length];
  
  const icons = { Sunny: "☀️", "Partly cloudy": "🌤️", Cloudy: "☁️", Rainy: "🌧️", Stormy: "⛈️" };
  const icon = icons[status] || "🌙";
  
  return { temp, snow, humidity, status, icon };
}

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = prevLastDay.getDate();
  
  calendarEl.grid.innerHTML = "";
  
  // Previous month days
  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const cell = document.createElement("div");
    cell.className = "calendar-day other-month";
    cell.textContent = day;
    calendarEl.grid.appendChild(cell);
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.textContent = day;
    
    if (selectedCalendarDate && 
        selectedCalendarDate.getDate() === day &&
        selectedCalendarDate.getMonth() === month &&
        selectedCalendarDate.getFullYear() === year) {
      cell.classList.add("selected");
    }
    
    cell.addEventListener("click", () => selectCalendarDate(dateObj, cell));
    calendarEl.grid.appendChild(cell);
  }
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  calendarEl.monthLabel.textContent = `${monthNames[month]}, ${year}`;
}

function selectCalendarDate(dateObj, cell) {
  selectedCalendarDate = dateObj;
  document.querySelectorAll(".calendar-day").forEach(c => c.classList.remove("selected"));
  cell.classList.add("selected");
  updateWeatherCard(dateObj);
  
  // Update Selected Date category
  selectedFilterDate = dateObj;
  const selectedDateLabel = document.getElementById("selected-date-label");
  if (selectedDateLabel) {
    selectedDateLabel.textContent = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  // Switch to selected-date category if not already there
  if (currentCategory === "selected-date") {
    loadTodos();
  }
}

async function fetchWeatherData(location) {
  try {
    // Using OpenWeatherMap API (free tier)
    // Note: You need to register at openweathermap.org to get your own API key
    const API_KEY = '9f8c6e1e3b2a5d4c7f8e9a0b1c2d3e4f'; // Demo key - replace with your own
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Location not found');
    }
    
    const data = await response.json();
    return {
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      status: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main),
      location: `${data.name}, ${data.sys.country}`
    };
  } catch (error) {
    console.error('Weather API error:', error);
    // Fallback to simulated data
    return calculateWeatherForDate(new Date());
  }
}

function getWeatherIcon(condition) {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  return icons[condition] || '🌤️';
}

async function updateWeatherCard(dateObj) {
  const today = new Date();
  const isToday = dateObj.toDateString() === today.toDateString();
  
  weatherEl.dayLabel.textContent = isToday ? "Today" : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  weatherEl.time.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  weatherEl.dateSmall.textContent = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  // For today, fetch real weather data
  if (isToday && weatherLocation) {
    const weather = await fetchWeatherData(weatherLocation);
    weatherEl.temp.textContent = `${weather.temp}°C`;
    weatherEl.humidity.textContent = `${weather.humidity}%`;
    weatherEl.status.textContent = weather.status;
    weatherEl.iconDiv.textContent = weather.icon;
    weatherEl.location.textContent = weather.location;
    weatherEl.snow.textContent = '0%'; // Not available in basic API
  } else {
    // For other dates, use simulated data
    const weather = calculateWeatherForDate(dateObj);
    weatherEl.temp.textContent = `${weather.temp}°C`;
    weatherEl.snow.textContent = `${weather.snow}%`;
    weatherEl.humidity.textContent = `${weather.humidity}%`;
    weatherEl.status.textContent = weather.status;
    weatherEl.iconDiv.textContent = weather.icon;
    weatherEl.location.textContent = weatherLocation;
  }
}

async function changeWeatherLocation() {
  const newLocation = prompt("Enter location (City, Country):", weatherLocation);
  if (newLocation && newLocation.trim()) {
    weatherLocation = newLocation.trim();
    await updateWeatherCard(selectedCalendarDate || new Date());
    showMessage("Location updated successfully", "success");
  }
}

async function initCalendar() {
  const today = new Date();
  currentCalendarYear = today.getFullYear();
  currentCalendarMonth = today.getMonth();
  selectedCalendarDate = today;
  
  buildCalendar(currentCalendarYear, currentCalendarMonth);
  await updateWeatherCard(today);
  
  calendarEl.prevBtn.addEventListener("click", () => {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
      currentCalendarMonth = 11;
      currentCalendarYear--;
    }
    buildCalendar(currentCalendarYear, currentCalendarMonth);
  });
  
  calendarEl.nextBtn.addEventListener("click", () => {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
      currentCalendarMonth = 0;
      currentCalendarYear++;
    }
    buildCalendar(currentCalendarYear, currentCalendarMonth);
  });
  
  if (weatherEl.closeBtn) {
    weatherEl.closeBtn.addEventListener("click", () => {
      weatherEl.card.style.display = "none";
    });
  }
  
  // Weather location change button
  const weatherLocationBtn = document.getElementById("weather-location-btn");
  if (weatherLocationBtn) {
    weatherLocationBtn.addEventListener("click", changeWeatherLocation);
  }
}

// ================================================================
// EVENT LISTENERS
// ================================================================

// Fast Add
el.addBtn.addEventListener("click", addFastTodo);
el.newTodo.addEventListener("keydown", e => {
  if (e.key === "Enter") addFastTodo();
});

// Search
el.searchInput.addEventListener("input", () => {
  currentSearch = el.searchInput.value;
  loadTodos();
});

// Clear completed
el.clearCompleted.addEventListener("click", clearCompleted);

// Sidebar categories
el.sideNavItems.forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    if (!category) return;

    currentCategory = category;
    selectedDirectory = null;

    el.sideNavItems.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".dir-item").forEach(d => d.classList.remove("active"));

    loadTodos();
  });
});

// Directories
el.dirNewBtn.addEventListener("click", createNewDirectory);
el.directoriesHeader.addEventListener("click", toggleDirectoriesCollapse);

// Modal events
el.sidebarNewTask.addEventListener("click", openModal);
el.topNewTask.addEventListener("click", openModal);

el.modalClose.addEventListener("click", closeModal);
el.modalCancel.addEventListener("click", closeModal);
el.modalOverlay.addEventListener("click", e => {
  if (e.target === el.modalOverlay) closeModal();
});

el.modalForm.addEventListener("submit", submitModal);
el.modalNewGroupBtn.addEventListener("click", modalCreateGroup);

// Bulk delete mode - trash icon
const trashIcon = document.querySelector('.top-actions .icon-btn:nth-child(2)');
if (trashIcon) {
  trashIcon.addEventListener("click", () => {
    if (bulkDeleteMode) {
      exitBulkDeleteMode();
    } else {
      enterBulkDeleteMode();
    }
  });
}

// Bulk actions - delete selected
const bulkDeleteBtn = document.getElementById("bulk-delete-btn");
if (bulkDeleteBtn) {
  bulkDeleteBtn.addEventListener("click", deleteSelectedTasks);
}

// Bulk actions - cancel
const bulkCancelBtn = document.getElementById("bulk-cancel-btn");
if (bulkCancelBtn) {
  bulkCancelBtn.addEventListener("click", exitBulkDeleteMode);
}

// ESC key to exit bulk mode or clear highlight
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (bulkDeleteMode) {
      exitBulkDeleteMode();
    } else if (highlightedTaskId) {
      highlightedTaskId = null;
      renderCurrentView();
    }
  }
});

// Click empty space to clear highlight
el.todoList.addEventListener("click", e => {
  if (e.target === el.todoList) {
    if (!bulkDeleteMode && highlightedTaskId) {
      highlightedTaskId = null;
      renderCurrentView();
    }
  }
});

// Sort button and menu
const sortBtn = document.getElementById("sort-btn");
if (sortBtn) {
  sortBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSortMenu();
  });
}

// Sort options
document.querySelectorAll(".sort-option").forEach(option => {
  option.addEventListener("click", () => {
    setSortMode(option.dataset.sort);
  });
});

// View toggle buttons
const viewBtns = document.querySelectorAll(".view-toggle .icon-btn");
viewBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    toggleViewMode();
  });
});

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
const userAvatar = document.getElementById('userAvatar');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
if (userAvatar) {
  userAvatar.addEventListener('click', logout);
  userAvatar.style.cursor = 'pointer';
}

// INIT APP
async function initApp() {
  console.log('🚀 initApp called');
  console.log('localStorage.token:', localStorage.getItem('token') ? 'EXISTS' : 'NULL');
  console.log('sessionStorage.token:', sessionStorage.getItem('token') ? 'EXISTS' : 'NULL');
  
  const token = getToken();
  console.log('getToken() result:', token ? 'FOUND' : 'NOT FOUND');
  
  if (!token) {
    console.log('❌ No token - redirecting to auth');
    window.location.href = '/auth.html';
    return;
  }
  
  console.log('✅ Token found, length:', token.length);
  console.log('Token preview:', token.substring(0, 50) + '...');

  // Display user info (after DOM is ready)
  const user = getUser();
  if (user) {
    const userName = document.getElementById('userName');
    if (userName) {
      userName.textContent = user.username || user.email;
    }
  }
  
  await loadTodos();
  await initCalendar();
}

// Start app
console.log('🔥🔥🔥 SCRIPT LOADED - VERSION 20251120-1605 🔥🔥🔥');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
