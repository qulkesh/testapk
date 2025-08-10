\
import React, { useEffect, useMemo, useState } from "react";

// -------------------------------------------------------------
// DocFinder — минимальный MVP «поиск инструкций для оборудования»
// Однофайловое React‑приложение: поиск, фильтры, сохранение в LocalStorage.
// Готово к развёртыванию как статическая страница (Vite/CRA/Next static export).
// -------------------------------------------------------------

// Типы
const CATEGORIES = [
  { id: "vfd", label: "ПЧВ (частотные приводы)" },
  { id: "plc", label: "ПЛК" },
  { id: "servo", label: "Сервоконтроллеры" },
  { id: "hmi", label: "HMI панели" },
  { id: "sensor", label: "Датчики / энкодеры" },
  { id: "other", label: "Другое" },
];

// Базовые демо‑данные (можно удалить/заменить)
const DEMO_DOCS = [
  {
    id: "1",
    category: "vfd",
    vendor: "Siemens",
    model: "G120",
    docType: "Руководство по эксплуатации",
    title: "SINAMICS G120 — Commissioning Manual",
    year: 2023,
    lang: "EN",
    link: "https://support.industry.siemens.com/",
    tags: ["Параметры", "ПУСК/ОСТАНОВ", "Ошибки F"],
  },
  {
    id: "2",
    category: "plc",
    vendor: "Siemens",
    model: "S7-1200",
    docType: "Справочник",
    title: "S7-1200 System Manual",
    year: 2022,
    lang: "EN/RU",
    link: "https://support.industry.siemens.com/",
    tags: ["TIA Portal", "LAD", "FB/FC"],
  },
  {
    id: "3",
    category: "servo",
    vendor: "SEW-Eurodrive",
    model: "MDX61B (MOVIAXIS/MOVIDRIVE)",
    docType: "Руководство по параметрам",
    title: "IPOS / Ошибки Fxx / Параметрирование",
    year: 2021,
    lang: "EN/DE",
    link: "https://www.sew-eurodrive.com/",
    tags: ["IPOS", "F42", "Энкодер"],
  },
  {
    id: "4",
    category: "hmi",
    vendor: "Weintek",
    model: "MT8071iE",
    docType: "Руководство",
    title: "EasyBuilder Pro User Manual",
    year: 2024,
    lang: "EN",
    link: "https://www.weintek.com/",
    tags: ["Recipe", "Modbus", "Macros"],
  },
  {
    id: "5",
    category: "sensor",
    vendor: "Autonics",
    model: "E50S8-1024-3-T-24",
    docType: "Datasheet",
    title: "Incremental Rotary Encoder E50S8",
    year: 2020,
    lang: "EN",
    link: "https://www.autonics.com/",
    tags: ["PPR", "NPN/PNP", "Подключение"],
  },
  {
    id: "6",
    category: "vfd",
    vendor: "INVT",
    model: "GD20",
    docType: "Руководство пользователя",
    title: "GD20 User Manual",
    year: 2019,
    lang: "EN/RU",
    link: "https://invt.com/",
    tags: ["ПИД", "Параметры", "Ошибки"],
  },
];

const STORAGE_KEY = "docfinder.customDocs.v1";

function useLocalDocs() {
  const [docs, setDocs] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch (e) {
      // ignore
    }
  }, [docs]);

  return [docs, setDocs];
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
      {children}
    </span>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-3 py-1 text-sm border transition " +
        (active ? "bg-black text-white" : "hover:bg-gray-100")
      }
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <div className="mb-1 text-sm text-gray-600">{label}</div>
      {children}
    </label>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 border rounded-2xl">
      <div className="text-xl font-medium">Ничего не найдено</div>
      <div className="text-gray-500 mt-1">
        Попробуйте уточнить запрос или снять часть фильтров.
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [customDocs, setCustomDocs] = useLocalDocs();
  const [addOpen, setAddOpen] = useState(false);

  const allDocs = useMemo(() => [...DEMO_DOCS, ...customDocs], [customDocs]);
  const vendors = useMemo(() => {
    const set = new Set(allDocs.map((d) => d.vendor));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allDocs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allDocs.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (vendor !== "all" && d.vendor !== vendor) return false;
      if (!q) return true;
      const hay = `${d.vendor} ${d.model} ${d.title} ${d.docType} ${d.tags?.join(" ") || ""} ${d.lang}`.toLowerCase();
      return hay.includes(q);
    });

    if (sort === "year") list = list.sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sort === "vendor") list = list.sort((a, b) => a.vendor.localeCompare(b.vendor));
    // relevance: оставляем как есть (по входному порядку)

    return list;
  }, [allDocs, category, vendor, query, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white grid place-items-center font-bold">
            DF
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold">DocFinder</div>
            <div className="text-xs text-gray-500">
              Поиск инструкций для ПЧВ, ПЛК, сервоконтроллеров и не только
            </div>
          </div>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-black"
            onClick={(e) => {
              e.preventDefault();
              setAddOpen(true);
            }}
          >
            + Добавить источник
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Search bar */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск: ‘G120 параметр пуск’, ‘S7-1200 ladder’, ‘GD20 ошибка’"
              className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black/10"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-xl px-3 py-2"
            >
              <option value="all">Все категории</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="border rounded-xl px-3 py-2"
            >
              {vendors.map((v) => (
                <option key={v} value={v}>
                  {v === "all" ? "Все производители" : v}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-xl px-3 py-2"
            >
              <option value="relevance">Сортировать: по релевантности</option>
              <option value="year">Сначала новые</option>
              <option value="vendor">По производителю (A→Z)</option>
            </select>
          </div>

          {/* Quick chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { q: "F42", label: "Ошибки Fxx" },
              { q: "IPOS", label: "IPOS" },
              { q: "TIA Portal", label: "TIA Portal" },
              { q: "Modbus", label: "Modbus" },
              { q: "PID", label: "PID" },
            ].map((c) => (
              <Chip key={c.q} active={query.toLowerCase().includes(c.q.toLowerCase())} onClick={() => setQuery(c.q)}>
                {c.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((d) => (
              <article key={d.id} className="bg-white border rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">{labelByCategory(d.category)}</div>
                    <h3 className="text-lg font-semibold leading-tight mt-0.5">
                      {d.vendor} — {d.model}
                    </h3>
                  </div>
                  {d.year ? (
                    <div className="text-xs text-gray-500">{d.year}</div>
                  ) : null}
                </div>
                <div className="mt-2 text-sm text-gray-700">{d.docType} · {d.lang}</div>
                <div className="mt-1 font-medium">{d.title}</div>
                {d.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {d.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                ) : null}
                <div className="mt-3 flex gap-2">
                  <a
                    className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                    href={d.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    title="Открыть документ"
                  >
                    Открыть документ
                  </a>
                  <button
                    className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => copyToClipboard(summarizeDoc(d))}
                    title="Скопировать карточку"
                  >
                    Копировать карточку
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer tips */}
        <div className="text-xs text-gray-500 mt-6">
          Совет: добавляйте свои ссылки на PDF/вики/даташиты через «Добавить источник». Они сохранятся в браузере (LocalStorage).
        </div>
      </main>

      {addOpen && (
        <AddModal
          onClose={() => setAddOpen(false)}
          onSubmit={(doc) => {
            setCustomDocs((prev) => [
              ...prev,
              { id: String(Date.now()), ...doc, tags: normTags(doc.tags) },
            ]);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
}

function labelByCategory(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || "Категория";
}

function summarizeDoc(d) {
  return `${d.vendor} ${d.model} — ${d.docType} (${d.lang}${d.year ? ", " + d.year : ""})
${d.title}
${d.link}`;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert("Скопировано в буфер обмена");
  } catch (e) {
    alert("Не удалось скопировать");
  }
}

function normTags(str) {
  if (!str) return [];
  return String(str)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function AddModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    category: "vfd",
    vendor: "",
    model: "",
    docType: "Руководство",
    title: "",
    year: new Date().getFullYear(),
    lang: "EN/RU",
    link: "",
    tags: "",
  });

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const valid = form.vendor && form.model && form.title && form.link;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl border shadow-xl p-4">
        <div className="flex items-start justify-between">
          <div className="text-lg font-semibold">Добавить источник</div>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>
            Закрыть
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <Field label="Категория">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="border rounded-xl px-3 py-2 w-full"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Производитель">
            <input
              className="border rounded-xl px-3 py-2 w-full"
              placeholder="например, Siemens"
              value={form.vendor}
              onChange={(e) => set("vendor", e.target.value)}
            />
          </Field>

          <Field label="Модель / серия">
            <input
              className="border rounded-xl px-3 py-2 w-full"
              placeholder="напр., G120, S7-1200, GD20"
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
            />
          </Field>

          <Field label="Тип документа">
            <input
              className="border rounded-xl px-3 py-2 w-full"
              placeholder="Руководство, Datasheet, QuickStart"
              value={form.docType}
              onChange={(e) => set("docType", e.target.value)}
            />
          </Field>

          <Field label="Название документа">
            <input
              className="border rounded-xl px-3 py-2 w-full"
              placeholder="Полное название"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          <Field label="Год">
            <input
              type="number"
              className="border rounded-xl px-3 py-2 w-full"
              value={form.year}
              onChange={(e) => set("year", Number(e.target.value))}
            />
          </Field>

          <Field label="Язык">
            <input
              className="border rounded-xl px-3 py-2 w-full"
              placeholder="EN/RU/DE"
              value={form.lang}
              onChange={(e) => set("lang", e.target.value)}
            />
          </Field>

          <Field label="Ссылка (URL)">
            <input
              className="border rounded-xl px-3 py-2 w-full"
              placeholder="https://..."
              value={form.link}
              onChange={(e) => set("link", e.target.value)}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Теги (через запятую)">
              <input
                className="border rounded-xl px-3 py-2 w-full"
                placeholder="например: PID, Modbus, Ошибки"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div>Подсказка: добавляйте ссылки на PDF или страницы поддержки производителя.</div>
          <div>Сохраняется локально (LocalStorage).</div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-xl border" onClick={onClose}>
            Отмена
          </button>
          <button
            className="px-4 py-2 rounded-xl border bg-black text-white disabled:opacity-40"
            disabled={!valid}
            onClick={() => onSubmit(form)}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
