import React, { useState } from "react";

// Компонент «Кассиры/Касса» для управления кассовыми аппаратами и персоналом.
// Здесь можно добавлять кассиров, назначать их на кассы, открывать/закрывать смены
// и настраивать права доступа к операциям.
export default function Kassa() {
  // Перечень возможных прав кассира
  const RIGHTS = [
    { key: "sale", label: "Продажи (пробитие чеков)" },
    { key: "openShift", label: "Открытие смены" },
    { key: "closeShift", label: "Закрытие смены" },
    { key: "cashIn", label: "Внесение денежных средств" },
    { key: "cashOut", label: "Изъятие денежных средств" },
    { key: "incasso", label: "Инкассация" },
    { key: "refund", label: "Возврат" },
    { key: "correction", label: "Чек коррекции" },
    { key: "discounts", label: "Скидки/промокоды" },
    { key: "reprint", label: "Печать дубликата чека" },
    { key: "reportsView", label: "Просмотр отчётности" },
    { key: "xReport", label: "X‑отчёт" },
    { key: "zReport", label: "Z‑отчёт" },
  ];

  // Список кассиров
  const [cashiers, setCashiers] = useState([
    { id: 1, fio: "Иванова Мария", inn: "", pin: "" },
    { id: 2, fio: "Петров Алексей", inn: "", pin: "" },
  ]);
  // Список касс (ККТ)
  const [registers, setRegisters] = useState([
    {
      id: "KKT-1",
      name: "Касса №1",
      shiftOpen: false,
      currentCashierId: null,
      assigned: [1, 2],
      rights: {
        "1": { sale: true, openShift: true },
        "2": {},
      },
    },
    {
      id: "KKT-2",
      name: "Касса №2",
      shiftOpen: true,
      currentCashierId: 2,
      assigned: [2],
      rights: {
        "2": { sale: true, closeShift: true },
      },
    },
  ]);
  // Текущий раздел: «registers», «list» или «rights»
  const [tab, setTab] = useState("registers");
  // Поля для добавления кассира
  const [newFio, setNewFio] = useState("");
  const [newInn, setNewInn] = useState("");
  // Выбор кассы и кассира на вкладке «Права»
  const [selReg, setSelReg] = useState("KKT-1");
  const [selCash, setSelCash] = useState(1);

  // Утилита: найти ФИО кассира по ID
  const nameById = (id) => cashiers.find((c) => c.id === id)?.fio || "";
  // Добавить нового кассира
  function addCashier() {
    if (!newFio.trim()) return;
    setCashiers([
      ...cashiers,
      { id: Date.now(), fio: newFio.trim(), inn: newInn.trim(), pin: "" },
    ]);
    setNewFio("");
    setNewInn("");
  }
  // Назначить кассира на кассу
  function assignCashier(regId, cashId) {
    setRegisters(
      registers.map((r) =>
        r.id === regId
          ? {
              ...r,
              assigned: r.assigned.includes(cashId)
                ? r.assigned
                : [...r.assigned, cashId],
            }
          : r
      )
    );
  }
  // Выбрать текущего кассира на кассе
  function chooseCashier(regId, cashId) {
    setRegisters(
      registers.map((r) =>
        r.id === regId ? { ...r, currentCashierId: cashId } : r
      )
    );
  }
  // Открыть смену
  function openShift(regId) {
    setRegisters(
      registers.map((r) =>
        r.id === regId ? { ...r, shiftOpen: true } : r
      )
    );
  }
  // Закрыть смену
  function closeShift(regId) {
    setRegisters(
      registers.map((r) =>
        r.id === regId ? { ...r, shiftOpen: false } : r
      )
    );
  }
  // Получить права для конкретного кассира на конкретной кассе
  const getRights = (reg, cashId) => {
    return (reg.rights && reg.rights[String(cashId)]) || {};
  };
  // Изменить (переключить) конкретное право
  function toggleRight(key) {
    setRegisters(
      registers.map((r) => {
        if (r.id !== selReg) return r;
        const rights = { ...(r.rights || {}) };
        const currentForCash = { ...(rights[String(selCash)] || {}) };
        currentForCash[key] = !currentForCash[key];
        rights[String(selCash)] = currentForCash;
        return { ...r, rights };
      })
    );
  }

  return (
    <div>
      {/* Навигация между разделами */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setTab("registers")}
          style={{ marginRight: "0.5rem" }}
        >
          Кассы
        </button>
        <button
          onClick={() => setTab("list")}
          style={{ marginRight: "0.5rem" }}
        >
          Сотрудники
        </button>
        <button onClick={() => setTab("rights")}>Права</button>
      </div>

      {/* Вкладка «Кассы» */}
      {tab === "registers" && (
        <div>
          {registers.map((reg) => (
            <div
              key={reg.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{reg.name}</div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>
                Смена: {reg.shiftOpen ? "открыта" : "закрыта"}
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <label>Текущий кассир:&nbsp;</label>
                <select
                  value={reg.currentCashierId || ""}
                  onChange={(e) => chooseCashier(reg.id, Number(e.target.value))}
                >
                  <option value="">—</option>
                  {reg.assigned.map((id) => (
                    <option key={id} value={id}>
                      {nameById(id)}
                    </option>
                  ))}
                </select>
                &nbsp;
                {!reg.shiftOpen ? (
                  <button onClick={() => openShift(reg.id)}>Открыть смену</button>
                ) : (
                  <button onClick={() => closeShift(reg.id)}>Закрыть смену</button>
                )}
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <label>Кассиры:&nbsp;</label>
                {reg.assigned.map((id) => (
                  <span key={id} style={{ marginRight: "0.3rem" }}>
                    {nameById(id)}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <select id={`sel-${reg.id}`}>
                  {cashiers
                    .filter((c) => !reg.assigned.includes(c.id))
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fio}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    const select = document.getElementById(`sel-${reg.id}`);
                    const val = select ? Number(select.value) : null;
                    if (val) assignCashier(reg.id, val);
                  }}
                >
                  Добавить кассира
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Вкладка «Сотрудники» */}
      {tab === "list" && (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc" }}>ФИО</th>
                <th style={{ borderBottom: "1px solid #ccc" }}>ИНН</th>
              </tr>
            </thead>
            <tbody>
              {cashiers.map((c) => (
                <tr key={c.id}>
                  <td style={{ borderBottom: "1px solid #eee" }}>{c.fio}</td>
                  <td style={{ borderBottom: "1px solid #eee" }}>{c.inn || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "1rem" }}>
            <input
              value={newFio}
              placeholder="ФИО"
              onChange={(e) => setNewFio(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            <input
              value={newInn}
              placeholder="ИНН (необязательно)"
              onChange={(e) => setNewInn(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            <button onClick={addCashier}>Добавить</button>
          </div>
        </div>
      )}

      {/* Вкладка «Права» */}
      {tab === "rights" && (
        <div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Касса:&nbsp;</label>
            <select value={selReg} onChange={(e) => setSelReg(e.target.value)}>
              {registers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Кассир:&nbsp;</label>
            <select
              value={selCash}
              onChange={(e) => setSelCash(Number(e.target.value))}
            >
              {cashiers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fio}
                </option>
              ))}
            </select>
          </div>
          <div>
            {RIGHTS.map((r) => {
              const reg = registers.find((rr) => rr.id === selReg);
              const rightsForCash = reg ? getRights(reg, selCash) : {};
              const enabled = rightsForCash[r.key] || false;
              return (
                <div key={r.key} style={{ marginBottom: "0.3rem" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleRight(r.key)}
                    />
                    &nbsp;{r.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}