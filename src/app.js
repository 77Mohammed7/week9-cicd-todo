import {
  addTask, toggleTask, removeTask, clearCompleted, filterTasks,
  getSummary, parseTasks
} from "./todo.js";

const STORAGE_KEY = "week9-taskflow-tasks";
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const summary = document.querySelector("#summary");
const emptyState = document.querySelector("#empty-state");
const clearButton = document.querySelector("#clear-completed");
const filterButtons = [...document.querySelectorAll("[data-filter]")];

function load() {
  try { return parseTasks(localStorage.getItem(STORAGE_KEY)); }
  catch { return []; }
}

let tasks = load();
let activeFilter = "all";

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch { /* Storage can be unavailable in private browsing. */ }
}

function generateId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

function render() {
  const stats = getSummary(tasks);
  summary.textContent = stats.remaining + (stats.remaining === 1 ? " task" : " tasks") + " remaining";
  clearButton.disabled = stats.completed === 0;
  clearButton.hidden = stats.completed === 0;

  for (const button of filterButtons) {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  }

  list.replaceChildren();
  const visible = filterTasks(tasks, activeFilter);
  emptyState.hidden = visible.length > 0;
  emptyState.querySelector("h3").textContent =
    activeFilter === "completed" ? "No completed tasks yet" :
    activeFilter === "active" ? "You're all caught up!" : "All clear!";
  emptyState.querySelector("p").textContent =
    activeFilter === "all" ? "Add a task above to get started." :
    "Try another filter or add a new task.";

  for (const task of visible) {
    const item = document.createElement("li");
    item.className = "task-item" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark " + task.title + " as " + (task.completed ? "active" : "completed"));
    checkbox.addEventListener("change", () => {
      tasks = toggleTask(tasks, task.id);
      save();
      render();
    });

    const title = document.createElement("span");
    title.className = "task-text";
    title.textContent = task.title;

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Delete " + task.title);
    remove.addEventListener("click", () => {
      tasks = removeTask(tasks, task.id);
      save();
      render();
    });

    item.append(checkbox, title, remove);
    list.append(item);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const next = addTask(tasks, input.value, generateId());
  if (next !== tasks) {
    tasks = next;
    input.value = "";
    save();
    render();
    input.focus();
  }
});

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    render();
  });
}

clearButton.addEventListener("click", () => {
  tasks = clearCompleted(tasks);
  save();
  render();
});

render();
