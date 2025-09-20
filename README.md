import React, { useMemo, useState } from "react";
import Kassa from "./Kassa";

/**********************
 * DANDY CRM / АРМ — FULL DEMO (FIXED)
 * — Клиентская панель = ваш готовый сайт (iframe) + RU/EN
 * — Админ/кассир = дашборд, меню, 2 кассы (обычная и плиточная), ЭДО, отчёты и т.д.
 * — Раздел «Кассиры/Касса» — отдельный файл Kassa.jsx
 * — Омни‑поиск по блюдам/товарам/техкартам/ЭДО/отчётам
 * Цвета: тёмно‑зелёный #0b5c3b, акцент #ffd24d
 **********************/

// ===== Тема =====
const COLORS = {
  bg: "#0b5c3b",
  card: "#ffffff",
  accent: "#ffd24d",
  text: "#0f172a",
  red: "#ef4444",
  blue: "#3b82f6",
  yellow: "#f59e0b",
  green: "#22c55e",
  muted: "#eaf3ee",
};

// ===== i18n (минимально) =====
const DICT = {
  ru: {
    dashboard: "Дашборд",
    orders: "Заказы",
    kds: "KDS",
    stock: "Склад",
    cashierReport: "Отчёт кассира",
    pos: "Касса/ККТ",
    posTiled: "Касса (плитки)",
    edo: "ЭДО",
    mercury: "Меркурий",
    honest: "Честный знак",
    egais: "ЕГАИС",
    couriers: "Курьеры",
    inventory: "Инвентаризация",
    pricing: "Пересчёт цен",
    reports: "Отчётность",
    alerts: "Уведомления",
    profile: "Профиль",
    menu: "Меню и товары",
    integrations: "Интеграции",
    marketing: "Маркетинг",
    client: "Клиент",
  },
  en: {
    dashboard: "Dashboard",
    orders: "Orders",
    kds: "KDS",
    stock: "Stock",
    cashierReport: "Cashier report",
    pos: "POS/Fiscal",
    posTiled: "POS (tiles)",
    edo: "EDO",
    mercury: "Mercury",
    honest: "HonestSign",
    egais: "EGAIS",
    couriers: "Couriers",
    inventory: "Inventory",
    pricing: "Repricing",
    reports: "Reports",
    alerts: "Alerts",
    profile: "Profile",
    menu: "Menu & Products",
    integrations: "Integrations",
    marketing: "Marketing",
    client: "Client",
  },
};

// ===== App root =====
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [lang, setLang] = useState("ru");
  const [account, setAccount] = useState({ email: "111", password: "111", site: "111", role: "администратор" });

  function handleLogin(e) {
    if (e) e.preventDefault();
    if (account.email === "111" && account.password === "111" && account.site === "111") {
      setAuthed(true);
    } else {
      alert("Неверные данные. Для теста используйте 111 / 111 / 111");
    }
  }

  if (!authed)
    return (
      <Login
        account={account}
        onChange={setAccount}
        onSubmit={handleLogin}
        onDemo={() => setAuthed(true)}
      />
    );

  return (
    <Shell
      email={account.email}
      site={account.site}
      role={account.role}
      lang={lang}
      setLang={setLang}
    />
  );
}

// ===== Login =====
function Login({ account, onChange, onSubmit, onDemo }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.muted }}>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-xl rounded-2xl shadow-lg p-8"
        style={{ background: COLORS.card }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Rabbit />
          <BrandTitle />
        </div>
        <h1 className="text-3xl font-extrabold mb-6" style={{ color: COLORS.bg }}>
          ВХОД
        </h1>
        <LabeledInput
          label="E-mail"
          placeholder="example@mail.ru"
          value={account.email}
          onChange={(v) => onChange({ ...account, email: v })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledInput
            type="password"
            label="Пароль"
            placeholder="Пароль"
            value={account.password}
            onChange={(v) => onChange({ ...account, password: v })}
          />
          <LabeledInput
            label="Название сайта"
            placeholder="Например: dandypizza.com"
            value={account.site}
            onChange={(v) => onChange({ ...account, site: v })}
          />
        </div>
        <div className="flex items-center gap-6 mt-4">
          <Radio
            checked={account.role === "кассир"}
            onChange={() => onChange({ ...account, role: "кассир" })}
          >
            Кассир
          </Radio>
          <Radio
            checked={account.role === "администратор"}
            onChange={() => onChange({ ...account, role: "администратор" })}
          >
            Администратор
          </Radio>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="submit"
            className="w-full py-3 rounded-full text-white text-lg font-bold"
            style={{ background: COLORS.bg }}
          >
            Войти
          </button>
          <button
            type="button"
            onClick={onDemo}
            className="w-full py-3 rounded-full text-lg font-bold"
            style={{ background: "#fff", color: COLORS.bg, border: "2px solid #0b5c3b" }}
          >
            Войти демо
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-3">Тест: 111 / 111 / 111</p>
      </form>
    </div>
  );
}

// ===== Shell =====
function Shell({ email, site, role, lang, setLang }) {
  const t = (k) => (DICT[lang] || DICT.ru)[k] || k;
  const [route, setRoute] = useState("dashboard");
  const [q, setQ] = useState("");

  // Каталог (для Меню, POS и плиточной кассы)
  const [dishes, setDishes] = useState([
    { id: 1, name: "Пепперони 30 см", cat: "Пицца", price: 399, cost: 180 },
    { id: 2, name: "Филадельфия", cat: "Роллы", price: 459, cost: 220 },
    { id: 3, name: "Пицца 42 см", cat: "Пицца", price: 999, cost: 480 },
    { id: 4, name: "Канада Стандарт", cat: "Роллы", price: 690, cost: 300 },
  ]);
  const [products, setProducts] = useState([
    { id: 1001, name: "Соус фирменный", cat: "Соусы", price: 49, cost: 15, sku: "SAUCE-001" },
  ]);

  // Демо-документы для омни-поиска
  const [edoDocs] = useState([
    { id: "УПД-000123", supplier: "ООО Поставщик", date: "2025-09-09", sum: 48230 },
  ]);
  const [reportsList] = useState([
    { id: "cashier-2025-09-09", title: "Отчёт кассира • 09.09.2025" },
    { id: "sales-2025-09", title: "Отчёт по продажам • Сентябрь" },
  ]);

  const [omniOpen, setOmniOpen] = useState(false);
  const [omniQ, setOmniQ] = useState("");
  function openOmni(initialQ = "") {
    setOmniQ(initialQ);
    setOmniOpen(true);
  }
  function goto(key) {
    setRoute(key);
    setOmniOpen(false);
  }

  const menu = useMemo(
    () => [
      ["dashboard", t("dashboard")],
      ["menu", t("menu")],
      ["orders", t("orders")],
      ["kds", t("kds")],
      ["stock", t("stock")],
      ["cashier-report", t("cashierReport")],
      ["pos", t("pos")],
      ["pos-kontur", t("posTiled")],
      ["kassa", "Кассиры"],
      ["edo", t("edo")],
      ["mercury", t("mercury")],
      ["honest", t("honest")],
      ["egais", t("egais")],
      ["couriers", t("couriers")],
      ["inventory", t("inventory")],
      ["pricing", t("pricing")],
      ["marketing", t("marketing")],
      ["client", t("client")],
      ["integrations", t("integrations")],
      ["reports", t("reports")],
      ["alerts", t("alerts")],
      ["profile", t("profile")],
    ],
    [lang]
  );

  // общий список для POS/плиток
  const catalogItems = useMemo(() => {
    const dishItems = dishes.map((d) => ({ id: d.id, name: d.name, cat: d.cat, price: d.price, photo: d.photo }));
    const prodItems = products.map((p) => ({ id: p.id, name: p.name, cat: p.cat, price: p.price, photo: p.photo }));
    return [...dishItems, ...prodItems];
  }, [dishes, products]);

  function updateCatalogItem(itemId, updater) {
    setDishes((prev) => prev.map((d) => (d.id === itemId ? updater({ ...d }) : d)));
    setProducts((prev) => prev.map((p) => (p.id === itemId ? updater({ ...p }) : p)));
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      {/* Header */}
      <div className="px-4 md:px-6 py-3" style={{ background: COLORS.bg }}>
        <div className="max-w-[1400px] mx-auto flex items-center gap-3">
          <Rabbit />
          <BrandTitle />
          <div className="ml-4 hidden md:flex items-center gap-2 flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по каталогу…"
              className="flex-1 px-4 py-2 rounded-full bg-white/95 text-gray-800 outline-none"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setRoute("client")}
              className={`px-4 py-2 rounded-full text-sm ${
                route === "client" ? "bg-emerald-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Клиентский сайт
            </button>
            <button
              onClick={() => setRoute("dashboard")}
              className={`px-4 py-2 rounded-full text-sm ${
                route !== "client" ? "bg-emerald-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Админ-панель
            </button>
            {route !== "client" && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white">
                <span>📞</span>
                <span className="font-semibold">+7 (925) 934-77-28</span>
                <span className="text-white/80 text-xs ml-1">техподдержка</span>
              </div>
            )}
            <LangSwitch lang={lang} setLang={setLang} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0 mt-4">
        {/* Sidebar */}
        <aside className="px-3 md:px-4 md:py-4" style={{ background: COLORS.bg }}>
          <nav className="space-y-1">
            {menu.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRoute(key)}
                className={`w-full text-left px-4 py-3 rounded-xl text-white/90 hover:bg-white/10 ${
                  route === key ? "bg-white/15" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main */}
        <main
          className="p-5 md:p-8 bg-[#0f6b49] rounded-t-2xl md:rounded-l-2xl"
          style={{ minHeight: "calc(100vh - 120px)" }}
        >
          <div className="space-y-6">
            {route === "dashboard" && <Dashboard />}
            {route === "menu" && (
              <MenuDishes
                dishes={dishes}
                setDishes={setDishes}
                products={products}
                setProducts={setProducts}
              />
            )}
            {route === "orders" && <Orders />}
            {route === "kds" && <KDS />}
            {route === "stock" && <Stock />}
            {route === "cashier-report" && <CashierReport />}
            {route === "pos" && (
              <POS items={catalogItems} onUpdateItem={updateCatalogItem} q={q} />
            )}
            {route === "pos-kontur" && <POSKontur items={catalogItems} />}
            {route === "kassa" && <Kassa />}
            {route === "edo" && <EDO />}
            {route === "mercury" && <Mercury />}
            {route === "honest" && <HonestSign />}
            {route === "egais" && <EGAIS />}
            {route === "couriers" && <Couriers />}
            {route === "inventory" && <Inventory />}
            {route === "pricing" && <Pricing />}
            {route === "marketing" && <Marketing />}
            {route === "client" && (
              <ClientSite lang={lang} onOpenSearch={openOmni} />
            )}
            {route === "integrations" && <Integrations />}
            {route === "reports" && <Reports />}
            {route === "alerts" && <Alerts />}
            {route === "profile" && (
              <Profile email={email} site={site} role={role} />
            )}
          </div>
        </main>
      </div>

      {/* Омни‑поиск */}
      <OmniSearchModal
        open={omniOpen}
        query={omniQ}
        setQuery={setOmniQ}
        dishes={dishes}
        products={products}
        edoDocs={edoDocs}
        reports={reportsList}
        onClose={() => setOmniOpen(false)}
        onGoto={(key) => goto(key)}
      />
    </div>
  );
}

// ===== Визуальные кусочки =====
function BrandTitle() {
  return (
    <div className="text-white">
      <div className="text-2xl md:text-3xl font-extrabold tracking-wide leading-none">
        ДЭНДИ
      </div>
      <div className="text-xs opacity-80">ПИЦЦА И СУШИ</div>
    </div>
  );
}
function Rabbit() {
  return (
    <div
      className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-pink-300 flex items-center justify-center shadow"
      title="зайчик"
    >
      🐰
    </div>
  );
}
function LabeledInput({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-medium mb-1">{label}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2"
      />
    </div>
  );
}
function Radio({ checked, onChange, children }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="radio" checked={checked} onChange={onChange} />
      <span>{children}</span>
    </label>
  );
}
function Card({ title, children, tone }) {
  const toneStyle =
    tone === "alert"
      ? { borderLeft: `6px solid ${COLORS.red}` }
      : tone === "warn"
      ? { borderLeft: `6px solid ${COLORS.yellow}` }
      : {};
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm" style={toneStyle}>
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <div className="text-sm text-gray-800">{children}</div>
    </div>
  );
}
function LangSwitch({ lang, setLang }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang("ru")}
        className={`px-2 py-1 rounded ${
          lang === "ru" ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
        }`}
      >
        RU
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2 py-1 rounded ${
          lang === "en" ? "bg-white/20 text-white" : "bg-white/10 text-white/70"
        }`}
      >
        EN
      </button>
    </div>
  );
}

// ===== Страницы (сокр.) =====
function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <Card title="Статус смены / Персонал">
        Открыта • Кассиры: 2 • Поваров: 3 • Курьеров: 4
      </Card>
      <Card title="Основные метрики">₽ 128 540 выручка • 144 заказов • 18 крит. остатки</Card>
      <Card title="Быстрые действия">
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded bg-[#0b5c3b] text-white">Открыть смену</button>
          <button className="px-3 py-2 rounded bg-[#0b5c3b] text-white">Создать заказ</button>
          <button className="px-3 py-2 rounded bg-[#0b5c3b] text-white">Инвентаризация</button>
        </div>
      </Card>
      <Card title="Лента активности (live)">
        <ul className="list-disc ml-5 space-y-1">
          <li>Заказ #1029 принят (Яндекс Еда)</li>
          <li>Фискализация чека успешна</li>
          <li>Курьер Алексей передал заказ → едет обратно</li>
        </ul>
      </Card>
      <Card title="Критические алерты" tone="alert">
        Остаток «Лосось» &lt; 1.0 кг • Срок оплаты накладной ООO «Поставщик» — завтра
      </Card>
      <Card title="Платёжный календарь">Сегодня: аренда; завтра: ОФД; 25.09 — УСН</Card>
    </div>
  );
}

function MenuDishes({ dishes, setDishes, products, setProducts }) {
  const [tab, setTab] = useState("dishes");
  const [form, setForm] = useState({
    name: "",
    cat: "",
    desc: "",
    price: 0,
    cost: 0,
    mods: "",
    alrg: "",
    nutrition: "",
    photo: "",
    sku: "",
  });

  const add = () => {
    if (!form.name) return;
    if (tab === "dishes") {
      setDishes((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          cat: form.cat,
          price: +form.price,
          cost: +form.cost,
          desc: form.desc,
          mods: form.mods ? form.mods.split(",").map((s) => s.trim()) : [],
          photo: form.photo,
          alrg: form.alrg,
          nutrition: form.nutrition,
        },
      ]);
    } else {
      setProducts((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          cat: form.cat,
          price: +form.price,
          cost: +form.cost,
          sku: form.sku || `SKU-${Date.now()}`,
          photo: form.photo,
        },
      ]);
    }
    setForm({
      name: "",
      cat: "",
      desc: "",
      price: 0,
      cost: 0,
      mods: "",
      alrg: "",
      nutrition: "",
      photo: "",
      sku: "",
    });
  };

  const onFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, photo: url }));
  };

  function importCSV(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          alert("CSV пустой");
          return;
        }
        const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const idx = (k) => header.indexOf(k);
        const iType = idx("type"),
          iName = idx("name"),
          iCat = idx("category"),
          iPrice = idx("price"),
          iCost = idx("cost"),
          iDesc = idx("desc"),
          iMods = idx("mods"),
          iAlrg = idx("alrg"),
          iNut = idx("nutrition"),
          iSku = idx("sku"),
          iPhoto = idx("photo");
        const newD = [];
        const newP = [];
        for (let li = 1; li < lines.length; li++) {
          const raw = lines[li].split(",");
          const type = iType >= 0 ? (raw[iType] || "dish").trim().toLowerCase() : "dish";
          const name = raw[iName]?.trim();
          if (!name) continue;
          const cat = raw[iCat]?.trim() || "Прочее";
          const price = Number(raw[iPrice] || 0);
          const cost = Number(raw[iCost] || 0);
          const photo = iPhoto >= 0 ? raw[iPhoto]?.trim() : "";
          if (type === "product") {
            const sku = (iSku >= 0 ? raw[iSku]?.trim() : "") || `SKU-${Date.now()}-${li}`;
            newP.push({ id: Date.now() + li, name, cat, price, cost, sku, photo });
          } else {
            const desc = iDesc >= 0 ? raw[iDesc] : "";
            const mods = iMods >= 0 && raw[iMods] ? String(raw[iMods]).split("|").map((s) => s.trim()) : [];
            const alrg = iAlrg >= 0 ? raw[iAlrg] : "";
            const nutrition = iNut >= 0 ? raw[iNut] : "";
            newD.push({ id: Date.now() + li, name, cat, price, cost, desc, mods, alrg, nutrition, photo });
          }
        }
        if (newD.length) setDishes((prev) => [...prev, ...newD]);
        if (newP.length) setProducts((prev) => [...prev, ...newP]);
        alert(`Импортировано: блюд ${newD.length}, товаров ${newP.length}`);
      } catch (e) {
        alert("Ошибка разбора CSV. Убедитесь, что используется запятая как разделитель.");
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function loadSample() {
    const sample =
      `type,name,category,price,cost,desc,mods,alrg,nutrition,sku,photo\n` +
      `dish,Маргарита 30 см,Пицца,349,160,Классика,Острый соус|Доп. сыр,молоко,б/ж/у,,,\n` +
      `dish,Калифорния,Роллы,429,210,Краб,Соус унаги|Кунжут,рыба,б/ж/у,,,\n` +
      `product,Кола 0.5,Напитки,120,40,Газ.напиток,,, ,COLA-05,`;
    const blob = new Blob([sample], { type: "text/csv" });
    const file = new File([blob], "sample.csv", { type: "text/csv" });
    importCSV(file);
  }

  return (
    <div className="space-y-4">
      <Card title="Каталог">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTab("dishes")}
            className={`px-3 py-2 rounded ${tab === "dishes" ? "bg-[#0b5c3b] text-white" : "bg-white"}`}
          >
            Блюда
          </button>
          <button
            onClick={() => setTab("products")}
            className={`px-3 py-2 rounded ${tab === "products" ? "bg-[#0b5c3b] text-white" : "bg-white"}`}
          >
            Товары
          </button>
          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importCSV(f);
                }}
              />
            </label>
            <button className="px-3 py-2 rounded bg-gray-100" onClick={loadSample}>
              Загрузить тестовый CSV
            </button>
          </div>
        </div>
        {tab === "dishes" ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2">Фото</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Себестоимость</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="py-2">
                    {d.photo ? (
                      <img src={d.photo} alt="фото" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{d.name}</td>
                  <td>{d.cat}</td>
                  <td>₽ {d.price}</td>
                  <td>₽ {d.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2">Фото</th>
                <th>Название</th>
                <th>Категория</th>
                <th>SKU</th>
                <th>Цена</th>
                <th>Себестоимость</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">
                    {p.photo ? (
                      <img src={p.photo} alt="фото" className="w-10 h-10 object-cover rounded" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.cat}</td>
                  <td>{p.sku}</td>
                  <td>₽ {p.price}</td>
                  <td>₽ {p.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card title={tab === "dishes" ? "Добавить блюдо" : "Добавить товар"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledInput
            label="Название"
            placeholder={tab === "dishes" ? "Например: Филадельфия" : "Например: Соус фирменный"}
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <LabeledInput
            label="Категория"
            placeholder={tab === "dishes" ? "Роллы / Пицца" : "Соусы / Напитки"}
            value={form.cat}
            onChange={(v) => setForm({ ...form, cat: v })}
          />
          <LabeledInput label="Цена, ₽" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <LabeledInput label="Себестоимость, ₽" type="number" value={form.cost} onChange={(v) => setForm({ ...form, cost: v })} />
          {tab === "dishes" && (
            <LabeledInput
              label="Модификаторы"
              placeholder="соус, доп. сыр"
              value={form.mods}
              onChange={(v) => setForm({ ...form, mods: v })}
            />
          )}
          {tab === "dishes" && (
            <LabeledInput
              label="Аллергены"
              placeholder="рыба, молоко"
              value={form.alrg}
              onChange={(v) => setForm({ ...form, alrg: v })}
            />
          )}
          {tab === "dishes" && (
            <LabeledInput
              label="Пищевая ценность"
              placeholder="белки/жиры/углеводы"
              value={form.nutrition}
              onChange={(v) => setForm({ ...form, nutrition: v })}
            />
          )}
          {tab === "products" && (
            <LabeledInput label="SKU" placeholder="SKU-000" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
          )}
          <div>
            <div className="text-sm font-medium mb-1">Описание</div>
            <textarea
              className="w-full rounded-xl border px-4 py-3"
              rows={3}
              placeholder="Описание"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Изображение</div>
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            {form.photo && (
              <div className="mt-2">
                <img src={form.photo} alt="превью" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={add} className="px-4 py-2 rounded bg-[#0b5c3b] text-white">
            Добавить
          </button>
        </div>
        <div className="text-xs text-gray-600 mt-2">
          CSV-колонки: type(dish|product), name, category, price, cost, desc, mods("a|b"), alrg, nutrition, sku, photo(URL)
        </div>
      </Card>
    </div>
  );
}

function Orders() {
  const [filter, setFilter] = useState("all");
  const rows = useMemo(
    () => [
      { id: 1029, client: "Смирнова И.", amount: 880, status: "принят", channel: "Сайт", courier: "Алексей", eta: "12 мин" },
      { id: 1028, client: "Громов П.", amount: 1120, status: "готовится", channel: "Яндекс Еда", courier: "Марина", eta: "9 мин" },
      { id: 1027, client: "Петров А.", amount: 980, status: "готов", channel: "Delivery", courier: "Павел", eta: "—" },
      { id: 1026, client: "Зорина Н.", amount: 750, status: "у курьера", channel: "ВкусВилл", courier: "Марина", eta: "7 мин" },
      { id: 1025, client: "Катаев С.", amount: 1399, status: "доставлен", channel: "Сайт", courier: "—", eta: "0" },
    ],
    []
  );
  const visible = rows.filter((r) => filter === "all" || r.status === filter);
  return (
    <div className="space-y-4">
      <Card title="Фильтр статуса">
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "Все"],
            ["принят", "Принят"],
            ["готовится", "Готовится"],
            ["готов", "Готов"],
            ["у курьера", "У курьера"],
            ["доставлен", "Доставлен"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1 rounded-full ${filter === k ? "text-white" : "text-gray-800"}`}
              style={{ background: filter === k ? COLORS.accent : COLORS.card }}
            >
              {l}
            </button>
          ))}
        </div>
      </Card>
      <Card title="Заказы">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2">№</th>
              <th>Клиент</th>
              <th>Канал</th>
              <th>Курьер</th>
              <th>ETA</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2">{r.id}</td>
                <td>{r.client}</td>
                <td>{r.channel}</td>
                <td>{r.courier}</td>
                <td>{r.eta}</td>
                <td>₽ {r.amount}</td>
                <td>
                  <StatusPill status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
function StatusPill({ status }) {
  const map = {
    принят: "bg-gray-200",
    готовится: "bg-amber-300",
    готов: "bg-green-300",
    "у курьера": "bg-blue-300",
    доставлен: "bg-lime-300",
  };
  return <span className={`px-3 py-1 rounded-full text-xs ${map[status] || "bg-gray-200"}`}>{status}</span>;
}

function KDS() {
  const tiles = [
    { id: 1, dish: "Пепперони 30 см", dept: "Пицца", timer: "05:12", priority: "высокий" },
    { id: 2, dish: "Филадельфия", dept: "Суши", timer: "03:40", priority: "средний" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tiles.map((t) => (
        <Card key={t.id} title={`${t.dept} • ${t.dish}`}>
          SLA: {t.timer} • Приоритет: {t.priority} •
          <button className="px-3 py-1 rounded bg-green-100">Готово</button>
        </Card>
      ))}
    </div>
  );
}
function Stock() {
  return (
    <div className="space-y-4">
      <Card title="Остатки">Список ТМЦ, критические остатки выделены, FEFO и сроки годности.</Card>
      <Card title="Накладные">Импорт PDF/JPG/XLS • OCR • сопоставление номенклатуры • партии.</Card>
      <Card title="Инвентаризация">Пересчёт • протокол расхождений • двойное подтверждение.</Card>
    </div>
  );
}
function CashierReport() {
  return (
    <div className="space-y-4">
      <Card title="Создать отчёт кассира">
        Строки расходов (категория, сумма, магазин, комментарий) • Загрузка фото чеков • OCR • «Завести в учёт».
      </Card>
      <Card title="История">Черновик / Проверен / Проведён • журнал исправлений.</Card>
    </div>
  );
}

// ===== Обычный POS =====
function POS({ items, onUpdateItem, q }) {
  const [cat, setCat] = useState("Все");
  const cats = useMemo(() => ["Все", ...Array.from(new Set(items.map((i) => i.cat)))], [items]);
  const [cart, setCart] = useState([]);
  const [quickName, setQuickName] = useState("");
  const [quickPrice, setQuickPrice] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [techDesc, setTechDesc] = useState("");
  const [techComp, setTechComp] = useState("");
  const [techFiles, setTechFiles] = useState([]);
  const [techPhoto, setTechPhoto] = useState("");

  const visible = items.filter(
    (i) => (cat === "Все" || i.cat === cat) && (q ? i.name.toLowerCase().includes(q.toLowerCase()) : true)
  );
  const total = cart.reduce((s, r) => s + r.price * r.qty, 0);

  function addToCart(i) {
    const key = Date.now() + Math.random();
    setCart((prev) => [...prev, { key, itemId: i.id, name: i.name, price: i.price, qty: 1 }]);
  }
  function addQuick() {
    if (!quickName || !quickPrice) return;
    const key = Date.now() + Math.random();
    setCart((prev) => [...prev, { key, itemId: null, name: quickName, price: Number(quickPrice) || 0, qty: 1 }]);
    setQuickName("");
    setQuickPrice(0);
  }
  function inc(row) {
    setCart((prev) => prev.map((r) => (r.key === row.key ? { ...r, qty: r.qty + 1 } : r)));
  }
  function dec(row) {
    setCart((prev) => prev.map((r) => (r.key === row.key ? { ...r, qty: Math.max(1, r.qty - 1) } : r)));
  }
  function removeRow(row) {
    setCart((prev) => prev.filter((r) => r.key !== row.key));
  }

  function onTechFiles(files) {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setTechFiles((prev) => [...prev, ...urls]);
  }
  function onTechPhoto(file) {
    if (!file) return;
    setTechPhoto(URL.createObjectURL(file));
  }
  function openTech(item) {
    setEditingId(item.id);
    setTechDesc("");
    setTechComp("");
    setTechFiles([]);
    setTechPhoto(item.photo || "");
  }
  function saveTech() {
    if (editingId == null) return;
    onUpdateItem(editingId, (d) => ({
      ...d,
      photo: techPhoto || d.photo,
      tech: { description: techDesc, composition: techComp, files: techFiles },
    }));
    setEditingId(null);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_360px] gap-4">
      <Card title="Категории">
        <div className="flex lg:flex-col gap-2 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-2 rounded ${cat === c ? "bg-[#0b5c3b] text-white" : "bg-white"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-sm font-semibold mb-1">Быстрая позиция (фикс. цена)</div>
          <input
            placeholder="Название"
            className="w-full rounded border px-3 py-2 mb-2"
            value={quickName}
            onChange={(e) => setQuickName(e.target.value)}
          />
          <input
            placeholder="Цена, ₽"
            type="number"
            className="w-full rounded border px-3 py-2 mb-2"
            value={quickPrice}
            onChange={(e) => setQuickPrice(parseFloat(e.target.value || "0"))}
          />
          <button onClick={addQuick} className="px-3 py-2 rounded bg-[#0b5c3b] text-white w-full">
            Добавить в чек
          </button>
        </div>
      </Card>

      <Card title="Меню">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {visible.map((i) => (
            <div key={i.id} className="rounded-xl border bg-white p-3 flex flex-col">
              <div className="flex-1">
                <div className="text-sm font-semibold mb-1">{i.name}</div>
                <div className="text-xs text-gray-500 mb-2">{i.cat}</div>
                {i.photo ? (
                  <img src={i.photo} alt="фото" className="w-full h-24 object-cover rounded" />
                ) : (
                  <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                    нет фото
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="font-bold">₽ {i.price}</div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded bg-[#0b5c3b] text-white" onClick={() => addToCart(i)}>
                    В чек
                  </button>
                  <button className="px-3 py-1 rounded bg-gray-100" onClick={() => openTech(i)}>
                    Техкарта
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Чек">
        {cart.length === 0 && <div className="text-sm text-gray-500">Пусто</div>}
        {cart.length > 0 && (
          <div className="space-y-2">
            {cart.map((r) => (
              <div key={r.key} className="rounded border p-2 bg-white">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.name}</div>
                  <button className="text-xs text-red-600" onClick={() => removeRow(r)}>
                    убрать
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1 text-sm">
                  <div className="flex items-center gap-2">
                    <button className="px-2 rounded bg-gray-100" onClick={() => dec(r)}>
                      -
                    </button>
                    <div>{r.qty}</div>
                    <button className="px-2 rounded bg-gray-100" onClick={() => inc(r)}>
                      +
                    </button>
                  </div>
                  <div>₽ {r.price * r.qty}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t font-semibold">
              <div>Итого</div>
              <div>₽ {total}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button className="px-3 py-2 rounded bg-white border">Нал</button>
              <button className="px-3 py-2 rounded bg-white border">Карта</button>
              <button className="px-3 py-2 rounded bg-white border">СБП</button>
            </div>
            <button className="mt-2 w-full px-3 py-3 rounded bg-[#0b5c3b] text-white">Пробить чек</button>
          </div>
        )}
      </Card>

      {editingId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">Техкарта</div>
              <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded bg-gray-100">
                Закрыть
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Описание</div>
                <textarea
                  className="w-full rounded border px-3 py-2"
                  rows={4}
                  value={techDesc}
                  onChange={(e) => setTechDesc(e.target.value)}
                />
                <div className="text-sm font-medium mb-1 mt-3">Состав (ингредиенты)</div>
                <textarea
                  className="w-full rounded border px-3 py-2"
                  rows={6}
                  placeholder="ингредиент — граммы\n..."
                  value={techComp}
                  onChange={(e) => setTechComp(e.target.value)}
                />
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Изображение</div>
                <input type="file" accept="image/*" onChange={(e) => onTechPhoto(e.target.files?.[0] || null)} />
                {techPhoto && (
                  <img src={techPhoto} alt="фото" className="mt-2 w-full h-40 object-cover rounded" />
                )}
                <div className="text-sm font-medium mb-1 mt-3">Файлы (PDF/JPG и др.)</div>
                <input type="file" multiple onChange={(e) => onTechFiles(e.target.files)} />
                {techFiles.length > 0 && (
                  <ul className="mt-2 list-disc ml-5 text-sm text-gray-700">
                    {techFiles.map((u, idx) => (
                      <li key={idx}>
                        <a href={u} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                          Вложение {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded bg-gray-100">
                Отмена
              </button>
              <button onClick={saveTech} className="px-4 py-2 rounded bg-[#0b5c3b] text-white">
                Сохранить
              </button>
            </di
