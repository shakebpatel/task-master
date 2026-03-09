"use client";

import { useState, useEffect } from "react";

// Task type definition
interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Initialize tasks from localStorage (only runs on client)
function getInitialTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    try {
      return JSON.parse(savedTasks);
    } catch (e) {
      console.error("Failed to parse tasks:", e);
    }
  }
  return [];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Save tasks to localStorage when tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add new task
  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setIsAddingTask(false);
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Start editing task
  const startEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description);
  };

  // Save edited task
  const saveEdit = () => {
    if (!editingTask || !editTitle.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, title: editTitle.trim(), description: editDesc.trim() }
          : task
      )
    );
    setEditingTask(null);
    setEditTitle("");
    setEditDesc("");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditDesc("");
  };

  // Cancel adding task
  const cancelAdd = () => {
    setNewTaskTitle("");
    setNewTaskDesc("");
    setIsAddingTask(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-12 px-4 sm:items-start sm:px-8">
        <div className="flex w-full flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Task Manager
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage your tasks efficiently
            </p>
          </div>

          {/* Add Task Button */}
          {!isAddingTask && !editingTask && (
            <button
              onClick={() => setIsAddingTask(true)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
            >
              + Add Task
            </button>
          )}

          {/* Add Task Form */}
          {isAddingTask && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="mb-4 text-lg font-medium text-black dark:text-zinc-50">
                Add New Task
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Task description (optional)"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addTask}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelAdd}
                    className="rounded-md bg-zinc-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Task List */}
          <div className="flex flex-col gap-3">
            {tasks.length === 0 ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-zinc-500 dark:text-zinc-400">
                  No tasks yet. Click `Add Task` to create one!
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* Edit Mode */}
                  {editingTask?.id === task.id ? (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-md bg-zinc-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-black dark:text-zinc-50">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            {task.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-zinc-400">
                          Created:{" "}
                          {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(task)}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Task Count */}
          {tasks.length > 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Total tasks: {tasks.length}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
