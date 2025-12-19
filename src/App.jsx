import React, { useMemo, useState } from "react";
import "./styles.css";

const CATEGORIES = ["Все", "Lifestyle", "Бег", "Баскетбол", "Лимитка"];

const SNEAKERS = [
  {
    id: "aurora",
    name: "Aurora Runner",
    brand: "Nike ZoomX",
    price: 18990,
    category: "Бег",
    colorway: "Туман / Лаванда",
    badge: "Новинка",
    tagline: "Облачная амортизация и упругий толчок для длинных дистанций.",
    limited: false,
    rating: 4.9,
    accent: "#b6b4ff",
  },
  {
    id: "pulse",
    name: "Pulse 97",
    brand: "New Balance",
    price: 21490,
    category: "Lifestyle",
    colorway: "Лёд / Хлопковый белый",
    badge: "Топ недели",
    tagline: "Слоистый upper с микрофиброй и воздушной подошвой FreshFoam.",
    limited: false,
    rating: 4.8,
    accent: "#9ad6ff",
  },
  {
    id: "solstice",
    name: "Solstice Edge",
    brand: "adidas Originals",
    price: 23990,
    category: "Лимитка",
    colorway: "Пепел / Глиттер",
    badge: "Limited drop",
    tagline: "Металлизированные вставки, прозрачные панели и контрастные шнурки.",
    limited: true,
    rating: 4.95,
    accent: "#ffd6f6",
  },
  {
    id: "drift",
    name: "Drift Court",
    brand: "PUMA Hoops",
    price: 17690,
    category: "Баскетбол",
    colorway: "Сапфир / Снег",
    badge: "Energy return",
    tagline: "Максимальная стабилизация и резкий отклик на паркете.",
    limited: false,
    rating: 4.7,
    accent: "#b0e4ff",
  },
  {
    id: "orbit",
    name: "Orbit 2.0",
    brand: "HOKA",
    price: 20500,
    category: "Бег",
    colorway: "Молоко / Электрик",
    badge: "Carbon ride",
    tagline: "Карbon plate + rocker для бесшовного переката и скорости.",
    limited: false,
    rating: 4.85,
    accent: "#d7f7ff",
  },
  {
    id: "neon",
    name: "Neon Nova",
    brand: "ASICS",
    price: 16290,
    category: "Lifestyle",
    colorway: "Мята / Кварц",
    badge: "City ready",
    tagline: "Сетчатый upper, отражающие элементы и мягкий гель.",
    limited: false,
    rating: 4.6,
    accent: "#c6ffd5",
  },
  {
    id: "zenith",
    name: "Zenith Flow",
    brand: "ON Cloud",
    price: 22800,
    category: "Бег",
    colorway: "Холодный беж / Хром",
    badge: "CloudTec®",
    tagline: "Нейтральный бег с лёгким пружинящим эффектом и супер grip.",
    limited: false,
    rating: 4.88,
    accent: "#d5d9ff",
  },
  {
    id: "monolith",
    name: "Monolith LX",
    brand: "Y-3",
    price: 27990,
    category: "Лимитка",
    colorway: "Графит / Опал",
    badge: "Drop 02",
    tagline: "Архитектурный силуэт с полупрозрачной подошвой и премиум нубуком.",
    limited: true,
    rating: 4.93,
    accent: "#f2e8ff",
  },
];

const formatPrice = (value) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);

function CategoryChip({ label, active, onClick }) {
  return (
    <button className={`chip ${active ? "chip--active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric glass">
      <div className="metric__value">{value}</div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

function ProductCard({ item, favorite, onToggleFavorite }) {
  return (
    <article className="product glass" style={{ "--accent": item.accent }}>
      <div className="product__top">
        <div className="product__badge">{item.badge}</div>
        <button className={`icon-btn ${favorite ? "icon-btn--active" : ""}`} onClick={onToggleFavorite}>
          <span>♥</span>
        </button>
      </div>
      <div className="product__brand">{item.brand}</div>
      <div className="product__name">{item.name}</div>
      <div className="product__meta">
        <span>{item.colorway}</span>
        <span>·</span>
        <span>{item.category}</span>
      </div>
      <div className="product__price-row">
        <div className="product__price">{formatPrice(item.price)}</div>
        <div className="pill pill--soft">★ {item.rating.toFixed(2)}</div>
      </div>
      <p className="product__desc">{item.tagline}</p>
      <div className="product__actions">
        <button className="ghost-btn">Детали</button>
        <button className="primary-btn">В корзину</button>
      </div>
    </article>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [onlyLimited, setOnlyLimited] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SNEAKERS.filter((item) => {
      const matchesCategory = category === "Все" || item.category === category;
      const matchesLimited = !onlyLimited || item.limited;
      const haystack = `${item.name} ${item.brand} ${item.colorway} ${item.tagline}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      return matchesCategory && matchesLimited && matchesQuery;
    });
  }, [category, onlyLimited, query]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="page">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />
      <div className="ambient ambient--three" />

      <div className="shell">
        <header className="topbar glass">
          <div className="brand-mark">
            <span className="brand-mark__dot" />
            <div>
              <div className="brand-mark__title">GlassKicks</div>
              <div className="brand-mark__subtitle">магазин кроссовок</div>
            </div>
          </div>
          <nav className="menu">
            <a href="#catalog">Каталог</a>
            <a href="#drops">Дропы</a>
            <a href="#support">Поддержка</a>
          </nav>
          <div className="topbar__actions">
            <button className="ghost-btn">Подбор</button>
            <button className="primary-btn">Корзина</button>
          </div>
        </header>

        <main className="layout">
          <section className="hero glass">
            <div>
              <div className="pill pill--soft">IOS 16 glass mood</div>
              <h1>
                Магазин кроссовок с <span className="accent">фрост</span>-эффектом и
                актуальными дропами.
              </h1>
              <p className="lead">
                Собрали беговые, баскетбольные и lifestyle пары в одном каталоге. Премиальные материалы,
                лёгкие силуэты и ощущение, как на дисплее iPhone.
              </p>
              <div className="hero__actions">
                <button className="primary-btn primary-btn--large">Смотреть каталог</button>
                <button className="ghost-btn ghost-btn--large">Конфигуратор</button>
              </div>
              <div className="metrics">
                <Metric label="Пар на складе" value="320+" />
                <Metric label="Гарантия" value="12 мес" />
                <Metric label="Доставка" value="1-2 дня" />
              </div>
            </div>
            <div className="hero__card glass">
              <div className="hero__tag">Дроп недели</div>
              <div className="hero__shoe">Pulse 97</div>
              <div className="hero__brand">New Balance · лед / белый</div>
              <div className="hero__price">{formatPrice(21490)}</div>
              <div className="hero__footer">
                <span className="pill pill--soft">Доступно 12 размеров</span>
                <button className="primary-btn">Забронировать</button>
              </div>
            </div>
          </section>

          <section id="catalog" className="panel glass">
            <div className="panel__head">
              <div>
                <p className="eyebrow">Каталог</p>
                <h2>Свежие пары с мягким стеклом</h2>
              </div>
              <div className="filter-row">
                <div className="input glass">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Поиск по бренду, цвету или названию"
                  />
                  <span className="input__hint">⌘K</span>
                </div>
                <div className="toggle" onClick={() => setOnlyLimited((v) => !v)}>
                  <div className={`toggle__thumb ${onlyLimited ? "toggle__thumb--on" : ""}`} />
                  <span>Только лимитки</span>
                </div>
              </div>
            </div>

            <div className="chips">
              {CATEGORIES.map((c) => (
                <CategoryChip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>

            <div className="grid">
              {filtered.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  favorite={favorites.includes(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="empty glass">
                <div className="empty__title">Ничего не нашли</div>
                <div className="empty__text">Смените категорию или уберите фильтр лимиток.</div>
              </div>
            )}
          </section>

          <section id="drops" className="panel panel--split">
            <div className="glass mini-card">
              <p className="eyebrow">Lookbook</p>
              <h3>Тактильные материалы</h3>
              <p>
                Матовая кожа, прозрачные вставки и объёмные шнурки. Смотрится так же свежо, как стеклянные плитки на iOS.
              </p>
              <div className="stacked">
                <span className="pill pill--soft">afterparty grey</span>
                <span className="pill pill--soft">mint quartz</span>
                <span className="pill pill--soft">night bloom</span>
              </div>
            </div>
            <div className="glass mini-card">
              <p className="eyebrow">Поддержка</p>
              <h3>Фитинг и подбор</h3>
              <p>
                Онлайн-консультант подскажет размер, подберёт стельку и отправит пуш, когда ваш размер появится.
              </p>
              <div className="cta-row">
                <button className="primary-btn">Написать</button>
                <button className="ghost-btn">Частые вопросы</button>
              </div>
            </div>
          </section>
        </main>

        <footer id="support" className="footer glass">
          <div>
            <div className="brand-mark__title">GlassKicks</div>
            <div className="footer__text">Магазин кроссовок в эстетике iOS: чистые поверхности, мягкие блики и много воздуха.</div>
          </div>
          <div className="footer__links">
            <a href="#catalog">Каталог</a>
            <a href="#drops">Дропы</a>
            <a href="#support">Поддержка</a>
          </div>
          <div className="footer__badge">2024 · Россия</div>
        </footer>
      </div>
    </div>
  );
}
