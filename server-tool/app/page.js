"use client";

import { useState, useEffect } from "react";
import MenuItemCard from "./components/MenuItemCard";

export default function Home() {
  const [menu, setMenu] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMenu() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/menu", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Could not load menu items.");
        }

        const data = await res.json();
        if (active) {
          setMenu(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Could not load menu items.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      setError("");
      const response = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Could not delete menu item.");
      }
      setMenu(menu.filter((item) => item._id !== id));
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete menu item.");
    }
  };

  const handleEditClose = async () => {
    setEditingId(null);

    try {
      setError("");
      const response = await fetch("/api/menu", { cache: "no-store" });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Could not refresh menu items.");
      }

      const data = await response.json();
      setMenu(Array.isArray(data) ? data : []);
    } catch (refreshError) {
      setError(refreshError.message || "Could not refresh menu items.");
    }
  };

  const hasMenuItems = menu.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-semibold">Menu</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading menu items...</p>
      ) : null}

      {error ? (
        <div className="rounded-md border border-destructive/60 bg-destructive/10 p-3 text-sm text-destructive-foreground">
          {error}
        </div>
      ) : null}

      {!loading && !error && !hasMenuItems ? (
        <div className="rounded-md border border-border/70 bg-card p-4 text-sm text-muted-foreground">
          No menu items found yet. Add items to MongoDB to see them here.
        </div>
      ) : null}

      {hasMenuItems ? (
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
      ) : null}
    </div>
  );
}
