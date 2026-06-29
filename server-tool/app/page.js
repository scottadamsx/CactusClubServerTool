"use client";

import { useState, useEffect } from "react";
import EditMenuItemForm from "./components/EditMenuItemForm";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    setMenu(menu.filter((item) => item._id !== id));
  };

  const handleEditClose = () => {
    setEditingId(null);
    // Re-fetch the menu to get updated data
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-semibold">Menu</h1>
      <ul className="flex flex-col gap-2">
        {menu.map((item) => (
          <li key={item._id.toString()} className="flex flex-col gap-2 border rounded p-2">
            {editingId === item._id.toString() ? (
              <EditMenuItemForm item={item} onClose={handleEditClose} />
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-lg text-foreground/90">{item.name} — ${item.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(item._id.toString())} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
