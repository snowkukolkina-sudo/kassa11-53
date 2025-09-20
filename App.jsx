import React, { useState } from "react";
import Kassa from "./Kassa";
import POSKontur from "./POSKontur";

// Простое приложение для демонстрации кассовой системы.
// Внизу две кнопки позволяют переключаться между плиточной кассой и управлением кассирами.
// Каталог позиций задаётся прямо в коде для простоты.
export default function App() {
  // Какая страница сейчас отображается: "pos" или "kassa"
  const [page, setPage] = useState("pos");
  // Простейший каталог: позиции с названием, категорией и ценой
  const items = [
    { id: 1, name: "Пепперони 30 см", cat: "Пицца", price: 399 },
    { id: 2, name: "Филадельфия", cat: "Роллы", price: 459 },
    { id: 3, name: "Том Ям", cat: "Супы", price: 299 },
    { id: 4, name: "Напиток кола", cat: "Напитки", price: 99 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        style={{
          background: "#0b5c3b",
          color: "#fff",
          padding: "1rem",
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setPage("pos")}
          style={{
            background: page === "pos" ? "#ffd24d" : "#ffffff",
            color: page === "pos" ? "#0f172a" : "#0b5c3b",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Плиточная касса
        </button>
        <button
          onClick={() => setPage("kassa")}
          style={{
            background: page === "kassa" ? "#ffd24d" : "#ffffff",
            color: page === "kassa" ? "#0f172a" : "#0b5c3b",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Управление кассирами
        </button>
      </header>
      <main style={{ flex: 1, padding: "1rem", background: "#eaf3ee" }}>
        {page === "pos" && <POSKontur items={items} />}
        {page === "kassa" && <Kassa />}
      </main>
    </div>
  );
}