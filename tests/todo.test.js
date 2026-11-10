import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeTitle, addTask, toggleTask, removeTask, clearCompleted,
  filterTasks, getSummary, parseTasks
} from "../src/todo.js";

const sample = [
  { id: "a", title: "Write code", completed: false },
  { id: "b", title: "Run tests", completed: true }
];

test("normalizes extra whitespace and rejects non-strings", () => {
  assert.equal(normalizeTitle("  My   task  "), "My task");
  assert.equal(normalizeTitle(null), "");
});

test("adds a task without mutating the original list", () => {
  const next = addTask(sample, "  New   task ", "c");
  assert.equal(next.length, 3);
  assert.deepEqual(next[2], { id: "c", title: "New task", completed: false });
  assert.equal(sample.length, 2);
});

test("ignores blank tasks and requires a valid identifier", () => {
  assert.equal(addTask(sample, "   ", "c"), sample);
  assert.throws(() => addTask(sample, "Valid", ""), TypeError);
});

test("toggles completion without modifying original objects", () => {
  const next = toggleTask(sample, "a");
  assert.equal(next[0].completed, true);
  assert.equal(sample[0].completed, false);
  assert.equal(next[1], sample[1]);
});

test("removes an identified task", () => {
  assert.deepEqual(removeTask(sample, "a"), [sample[1]]);
});

test("clears only completed tasks", () => {
  assert.deepEqual(clearCompleted(sample), [sample[0]]);
});

test("filters active and completed tasks", () => {
  assert.deepEqual(filterTasks(sample, "active"), [sample[0]]);
  assert.deepEqual(filterTasks(sample, "completed"), [sample[1]]);
  assert.deepEqual(filterTasks(sample, "all"), sample);
});

test("returns accurate summary counts", () => {
  assert.deepEqual(getSummary(sample), { total: 2, completed: 1, remaining: 1 });
});

test("loads valid tasks and safely rejects bad saved data", () => {
  assert.deepEqual(parseTasks("not json"), []);
  assert.deepEqual(parseTasks("{}"), []);
  const result = parseTasks(JSON.stringify([
    { id: "a", title: "  Hello  ", completed: true },
    { id: "a", title: "Duplicate", completed: false },
    { id: "b", title: " ", completed: false },
    { id: "c", title: "Work", completed: "yes" }
  ]));
  assert.deepEqual(result, [
    { id: "a", title: "Hello", completed: true },
    { id: "c", title: "Work", completed: false }
  ]);
});
