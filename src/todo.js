// Pure task operations: the same functions are used by the web app and CI tests.
export function normalizeTitle(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export function addTask(tasks, rawTitle, id) {
  const title = normalizeTitle(rawTitle);
  if (!title) return tasks;
  if (typeof id !== "string" || id.trim() === "") {
    throw new TypeError("A task ID is required.");
  }
  return [...tasks, { id, title, completed: false }];
}

export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function clearCompleted(tasks) {
  return tasks.filter((task) => !task.completed);
}

export function filterTasks(tasks, filter) {
  if (filter === "active") return tasks.filter((task) => !task.completed);
  if (filter === "completed") return tasks.filter((task) => task.completed);
  return tasks;
}

export function getSummary(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  return { total: tasks.length, completed, remaining: tasks.length - completed };
}

export function parseTasks(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids = new Set();
    return parsed.filter((task) => {
      if (!task || typeof task.id !== "string" || !task.id.trim()) return false;
      if (ids.has(task.id) || !normalizeTitle(task.title)) return false;
      ids.add(task.id);
      return true;
    }).slice(0, 500).map((task) => ({
      id: task.id,
      title: normalizeTitle(task.title).slice(0, 120),
      completed: task.completed === true
    }));
  } catch {
    return [];
  }
}
