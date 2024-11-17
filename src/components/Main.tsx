"use client";
import { Montserrat } from "next/font/google";
import { useEffect, useState } from "react";

// Importing the Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Type definition for a task
type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default function Main() {
  // State variables
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Load tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  // Save tasks to local storage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Function to add a new task
  const addingTask = () => {
    if (title.trim() === "" || description.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setDescription("");
  };

  // Function to delete a task
  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Function to mark a task as completed
  const completedTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filter tasks based on the search query
  const searchedTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-neutral-300 flex items-center justify-center">
      <div className="w-[70%] h-[600px] bg-neutral-200 rounded shadow-md flex flex-col items-center py-6">
        {/* Task Manager Title */}
        <h2
          className={`${montserrat.className} text-4xl font-bold underline text-neutral-700`}
        >
          Task Manager
        </h2>

        {/* Input fields for adding tasks */}
        <div className="w-full mt-9 flex flex-col items-center space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[80%] border bg-neutral-100 p-2 text-black"
            placeholder="Task Title"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-[80%] border bg-neutral-100 p-2 text-black"
            placeholder="Task Description"
          />
          <button
            onClick={addingTask}
            className="w-[80%] bg-neutral-700 text-white p-2 rounded-sm hover:bg-neutral-500 transition-colors duration-300"
          >
            Add Task
          </button>
        </div>

        {/* Search bar */}
        <div className="w-full flex ml-[200px] justify-start items-center mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[30%] border rounded-sm bg-neutral-300 p-2 text-black"
            placeholder="Search Task..."
          />
        </div>

        {/* Displaying the list of tasks */}
        <ul className="w-[80%] mt-6 overflow-scroll">
          {searchedTasks.map((task) => (
            <li
              key={task.id}
              className={`mb-4 p-4 rounded flex flex-col bg-gray-100 text-black ${
                task.completed ? "bg-neutral-300" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                {/* Apply line-through only to title and description */}
                <div
                  className={`flex flex-col ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => completedTask(task.id)}
                    className={` hover:bg-neutral-500 transition-colors duration-300 px-3 py-1 rounded ${
                      task.completed
                        ? "bg-gray-400 text-white"
                        : "bg-neutral-700 text-white"
                    }`}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded  hover:bg-neutral-500 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
