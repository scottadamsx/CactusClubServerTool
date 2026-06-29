"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-semibold">Menu</h1>
      <ul className="flex flex-col gap-2">
        {menu.map((item) => (
          <li key={item._id.toString()} className="text-lg text-foreground/90">
            {item.name} — ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
