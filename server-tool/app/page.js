"use client";

import { useState, useEffect } from "react";
import MenuItemCard from "./components/MenuItemCard";

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
          <MenuItemCard
            key={item._id.toString()}
            item={item}
            isEditing={editingId === item._id.toString()}
            onEdit={() => setEditingId(item._id.toString())}
            onClose={handleEditClose}
            onDelete={() => handleDelete(item._id)}
          />
        ))}
      </ul>
    </div>
  );
}
