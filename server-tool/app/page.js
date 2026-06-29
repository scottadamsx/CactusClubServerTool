"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    setMenu(menu.filter((item) => item._id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-semibold">Menu</h1>
      <ul className="flex flex-col gap-2">
        {menu.map((item) => (
          <li key={item._id.toString()} className="flex justify-between items-center text-lg text-foreground/90 border rounded p-2">
            <span>{item.name} — ${item.price}</span>
            <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
