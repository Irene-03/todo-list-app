/* ============================================
   To-Do List (Vanilla JS) — RTL + A11y + LocalStorage
   ============================================ */
(() => {
  'use strict';

  // عناصر DOM
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const addForm        = $('#addForm');
  const taskInput      = $('#taskInput');
  const addBtn         = $('#addBtn');
  const searchInput    = $('#searchInput');
  const taskList       = $('#taskList');
  const emptyState     = $('#emptyState');
  const filtersGroup   = $('#filters');
  const counter        = $('#counter');
  const clearCompleted = $('#clearCompleted');

  // آیکن‌های SVG (رشته‌های ثابت و امن)
  const ICONS = {
    trash: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2h-1v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4V5h4V4a1 1 0 0 1 1-1Zm1 4h4v12H8V7h2Z"/>
      </svg>`,
    edit: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.29a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/>
      </svg>`
  };

  // کلید ذخیره‌سازی
  const STORAGE_KEY = 'todo.v1';

  // حالت برنامه
  /** @type {{ tasks: Array<{id:string,text:string,done:boolean,createdAt:number,updatedAt:number}>, filter: 'all'|'active'|'completed' }} */
  let state = {
    tasks: [],
    filter: 'all'
  };

  // بارگذاری از localStorage
  loadState();
  render();

  /* ============== توابع کمکی ============== */

  function uid(){
    // تولید کننده شناسه یکتا (بدون نیاز به crypto)
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function toPersianDigits(num){
    const map = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return String(num).replace(/\d/g, d => map[d]);
  }

  function persist(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tasks: state.tasks,
        filter: state.filter
      }));
    } catch(err){
      // اگر ذخیره‌سازی به هر دلیل شکست خورد، ساکت رد می‌شویم
      // (مثلاً پر بودن کوتا یا حالت private)
      console.warn('Persist failed:', err);
    }
  }

  function loadState(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.tasks)) state.tasks = parsed.tasks;
      if (['all','active','completed'].includes(parsed.filter)) state.filter = parsed.filter;
    } catch(err){
      console.warn('Load failed:', err);
    }
  }

  /* ============== عملیات روی تسک‌ها ============== */

  function addTask(text){
    const t = {
      id: uid(),
      text: text,
      done: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    state.tasks.push(t);
    persist();
    render();
  }

  function updateTask(id, patch){
    const t = state.tasks.find(x => x.id === id);
    if(!t) return;
    Object.assign(t, patch);
    t.updatedAt = Date.now();
    persist();
    render();
  }

  function removeTask(id){
    const before = state.tasks.length;
    state.tasks = state.tasks.filter(x => x.id !== id);
    if (state.tasks.length !== before) {
      persist();
      render();
    }
  }

  function clearCompletedTasks(){
    const before = state.tasks.length;
    state.tasks = state.tasks.filter(x => !x.done);
    if (state.tasks.length !== before) {
      persist();
      render();
    }
  }

  /* ============== رندر ============== */

  function render(){
    // فیلتر و جستجو
    const q = (searchInput.value || '').trim().toLowerCase();
    const matchesQuery = t => !q || t.text.toLowerCase().includes(q);
    const matchesFilter = t =>
      state.filter === 'all' ? true :
      state.filter === 'active' ? !t.done : t.done;

    const filtered = state.tasks.filter(t => matchesFilter(t) && matchesQuery(t));

    // بازسازی لیست
    taskList.innerHTML = '';
    for (const task of filtered){
      taskList.appendChild(renderItem(task));
    }

    // حالت خالی
    if (state.tasks.length === 0){
      emptyState.textContent = 'هنوز کاری ثبت نکرده‌اید. از بخش بالا یک مورد اضافه کنید.';
      emptyState.style.display = 'block';
    } else if (filtered.length === 0){
      emptyState.textContent = 'هیچ موردی با شرایط جستجو/فیلتر فعلی پیدا نشد.';
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }

    // وضعیت فیلترها
    $$('.filter', filtersGroup).forEach(btn => {
      const isActive = btn.dataset.filter === state.filter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
    });

    // شمارنده
    const remaining = state.tasks.filter(t => !t.done).length;
    counter.textContent = `${toPersianDigits(remaining)} مورد باقی‌مانده`;

    // دکمه حذف انجام‌شده‌ها
    clearCompleted.disabled = !state.tasks.some(t => t.done);
  }

  function renderItem(task){
    const li = document.createElement('li');
    li.className = `task${task.done ? ' completed' : ''}`;
    li.dataset.id = task.id;
    li.tabIndex = 0;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'toggle';
    checkbox.id = `chk-${task.id}`;
    checkbox.checked = task.done;
    checkbox.title = 'انجام شد؟';

    const label = document.createElement('label');
    label.className = 'text';
    label.setAttribute('for', checkbox.id);
    label.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon edit';
    editBtn.title = 'ویرایش';
    editBtn.setAttribute('aria-label', 'ویرایش');
    editBtn.innerHTML = ICONS.edit;

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon delete';
    delBtn.title = 'حذف';
    delBtn.setAttribute('aria-label', 'حذف');
    delBtn.innerHTML = ICONS.trash;

    actions.append(editBtn, delBtn);
    li.append(checkbox, label, actions);

    // رخدادها
    checkbox.addEventListener('change', () => {
      updateTask(task.id, { done: checkbox.checked });
    });

    // کلیک روی متن هم انجام/لغو می‌کند (با استفاده از label و checkbox)
    label.addEventListener('click', () => {
      checkbox.checked = !checkbox.checked;
      updateTask(task.id, { done: checkbox.checked });
    });

    // حذف
    delBtn.addEventListener('click', () => removeTask(task.id));

    // ویرایش: دابل کلیک یا دکمه ویرایش
    const startEdit = () => beginInlineEdit(li, task);
    editBtn.addEventListener('click', startEdit);
    label.addEventListener('dblclick', startEdit);

    // حذف با کلید Delete زمانی که آیتم فوکوس دارد
    li.addEventListener('keydown', (ev) => {
      if (ev.key === 'Delete') removeTask(task.id);
    });

    return li;
  }

  function beginInlineEdit(li, task){
    if (li.classList.contains('editing')) return;
    li.classList.add('editing');

    const actions = $('.actions', li);
    const label = $('.text', li);
    label.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'editInput';
    input.value = task.text;
    input.maxLength = 120;
    input.setAttribute('aria-label', 'ویرایش متن کار');
    li.insertBefore(input, actions);

    // انتخاب متن و فوکوس
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    const commit = () => {
      const newText = (input.value || '').trim();
      li.classList.remove('editing');
      input.remove();
      label.style.display = '';
      if (!newText){
        // متن خالی = حذف
        removeTask(task.id);
        return;
      }
      if (newText !== task.text){
        updateTask(task.id, { text: newText });
      } else {
        // بدون تغییر
        render();
      }
    };

    const cancel = () => {
      li.classList.remove('editing');
      input.remove();
      label.style.display = '';
    };

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') commit();
      else if (ev.key === 'Escape') cancel();
    });
    input.addEventListener('blur', commit);
  }

  /* ============== رخدادهای سراسری ============== */

  // افزودن
  addForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const text = (taskInput.value || '').trim();
    if (!text) {
      taskInput.focus();
      return;
    }
    addTask(text);
    taskInput.value = '';
    taskInput.focus();
  });

  // جستجو در لحظه
  searchInput.addEventListener('input', render);

  // فیلترها
  filtersGroup.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.filter');
    if (!btn) return;
    const value = btn.dataset.filter;
    if (['all','active','completed'].includes(value)){
      state.filter = value;
      persist();
      render();
    }
  });

  // حذف انجام‌شده‌ها
  clearCompleted.addEventListener('click', clearCompletedTasks);
})();


