'use client';

import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { addTodoItem, removeTodoItem, updateTodoItem } from "@/services/state/roomSlice";
import TodoItem from "./TodoItem";
import { toast } from "react-hot-toast";

interface TodoListProps {
  minimized?: boolean;
}

export default function TodoList({ minimized = false }: TodoListProps) {
  const todoItems = useSelector((state: RootState) => state.room.todolist.items);
  const dispatch = useAppDispatch();
  const [task, setTask] = useState("");
  
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      const newTodo = {
        id: Date.now().toString(),
        text: task.trim(),
        completed: false
      };
      
      toast.success("Task added successfully!");
      dispatch(addTodoItem(newTodo));
      setTask("");
    }
  };

  const handleToggleComplete = (id: string) => {
    const todo = todoItems.find(item => item.id === id);
    if (todo) {
      dispatch(updateTodoItem({ id, completed: !todo.completed }));
    }
  };
  
  const handleDeleteTodo = (id: string) => {
    dispatch(removeTodoItem(id));
    toast.success("Task deleted successfully!");
  };
  
  return (
    <div className={cn("px-6 py-4 overflow-y-auto scroll-smooth h-[30vh] text-white")}>
      <h2 className={cn("text-2xl mb-3 text-center")}>📚 TO DO LIST 📜</h2>
      
      <form className={cn("flex items-center")} onSubmit={handleAddTodo}>
        <input 
          type="text" 
          placeholder="Add a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className={cn("bg-stone-800 text-white border border-stone-700 rounded px-3 py-2 w-full")}
        />
        <button 
          type="submit" 
          className={cn("bg-green-700 px-3 py-2 rounded-md ml-2 hover:bg-green-600")}
        >
          ADD
        </button>
      </form>
      
      <div className="mt-4">
        <ul className={cn("space-y-2")}>
          {todoItems.map((todo) => (
            <TodoItem 
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
} 