import React, { useState, useMemo } from "react";

// Компонент плиточной кассы в духе Контур.Маркета.
// Сначала отображает плитки категорий с количеством товаров.
// При выборе категории показывает плитки позиций; клик по позиции добавляет её в чек.
// Слева отображается список выбранных товаров с возможностью изменить количество.
export default function POSKontur({ items }) {
  // Текущая выбранная категория (null — показываем список категорий)
  const [currentCat, setCurrentCat] = useState(null);
  // Строка поиска
  const [search, setSearch] = useState("");
  // Содержимое чека: список выбранных товаров с количеством
  const [cart, setCart] = useState([]);

  // Построение списка категорий и количества товаров в каждой
  const categories = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      if (!map[item.cat]) map[item.cat] = 0;
      map[item.cat] += 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [items]);

  // Фильтр по категориям (учитываем поиск)
  const filteredCats = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  // Список позиций для выбранной категории и поиска
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      currentCat !== null &&
      item.cat === currentCat &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, currentCat, search]);

  // Добавить позицию в чек
  function addItem(item) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }
  // Увеличить количество
  function inc(id) {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  }
  // Уменьшить количество
  function dec(id) {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
      )
    );
  }
  // Удалить позицию из чека
  function remove(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }
  // Общая сумма
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        {/* поле поиска */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск..."
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        {/* если категория не выбрана — показываем категории */}
        {currentCat === null ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {filteredCats.map((cat) => (
              <div
                key={cat.name}
                onClick={() => {
                  setCurrentCat(cat.name);
                  setSearch("");
                }}
                style={{
                  background: "#ffd24d",
                  padding: "1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{cat.name}</div>
                <div style={{ fontSize: "0.8rem" }}>{cat.count} товаров</div>
              </div>
            ))}
          </div>
        ) : (
          // если выбрана категория — показываем товары
          <div>
            <button
              onClick={() => {
                setCurrentCat(null);
                setSearch("");
              }}
              style={{ marginBottom: "0.5rem" }}
            >
              ← Назад
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addItem(item)}
                  style={{
                    background: "#ffd24d",
                    padding: "1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                  <div style={{ fontSize: "0.8rem" }}>₽ {item.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Чек */}
      <div style={{ width: "300px" }}>
        <h3>Чек</h3>
        {cart.length === 0 ? (
          <div style={{ fontStyle: "italic", color: "#666" }}>Пока пусто</div>
        ) : (
          <div>
            {cart.map((i) => (
              <div
                key={i.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: "bold" }}>{i.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    ₽ {i.price} × {i.qty}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <button onClick={() => dec(i.id)}>-</button>
                  <span>{i.qty}</span>
                  <button onClick={() => inc(i.id)}>+</button>
                  <button onClick={() => remove(i.id)}>×</button>
                </div>
              </div>
            ))}
            <div style={{ fontWeight: "bold", marginTop: "0.5rem" }}>
              Итого: ₽ {total}
            </div>
            <button
              onClick={() => {
                alert(`Чек на сумму ₽ ${total} пробит!`);
                setCart([]);
              }}
              style={{
                marginTop: "0.5rem",
                background: "#0b5c3b",
                color: "#fff",
                padding: "0.5rem",
                borderRadius: "8px",
                width: "100%",
              }}
            >
              Пробить чек
            </button>
          </div>
        )}
      </div>
    </div>
  );
}