import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const img = (n) => `/images/photo_${n}_2026-08-26_21-21-01.jpg`;
const newImg = (name) => `/images/new/${name}`;
const booking = 'https://wa.me/?text=' + encodeURIComponent('Здравствуйте! Хочу забронировать место в BUNKER GAME ZONE.');

const zones = [
  ['PC', 'Боевые станции для серьёзной игры', newImg('pc.png'), '01'],
  ['PS5', 'Большой экран. Большие эмоции.', newImg('ps5.png'), '02'],
  ['VR', 'Погрузись в игру полностью', newImg('vr.png'), '03'],
  ['AUTO', 'Почувствуй каждый поворот', newImg('auto.png'), '04'],
  ['TENNIS', 'Игра вне экрана', newImg('tennis.png'), '05'],
];
const prices = [
  { title: 'PS5 · КАБИНКА', tag: 'GAME', accent: 'pink', rows: [['1 час', '300 сом'], ['2 + 1', '600 сом', 'АКЦИЯ'], ['5 часов', '900 сом'], ['Ночь · 00:00—10:00', '1000 сом']] },
  { title: 'PS5 + VR ОЧКИ', tag: 'IMMERSION', accent: 'pink', rows: [['1 час', '250 сом'], ['2 + 1', '500 сом', 'АКЦИЯ'], ['5 часов', '700 сом'], ['Ночь · 00:00—10:00', '800 сом']] },
  { title: 'АВТОСИМУЛЯТОР', tag: 'DRIVE', accent: 'yellow', rows: [['1 час', '250 сом'], ['2 + 1', '500 сом', 'АКЦИЯ'], ['5 часов', '700 сом']] },
  { title: 'ТЕННИС', tag: 'PLAY', accent: 'yellow', rows: [['1 час', '200 сом'], ['2 + 1', '400 сом', 'АКЦИЯ']] },
];
const specs = [['GPU', 'RTX 5060', '01'], ['CPU', 'Intel i5-14400F', '02'], ['RAM', '32 GB ОЗУ', '03'], ['MONITOR', 'ASUS VG279QM', '280 Hz'], ['KEYBOARD', 'RK-M75', '05'], ['HEADSET', 'MCHOSE S9 PRO', '06'], ['MOUSE', 'AJAZZ XNAGODEX AJ179 APEX', '07']];
const rules = [
  ['Уважайте других игроков', 'Не кричите и не мешайте другим гостям наслаждаться игрой.', '◉'],
  ['Подключение устройств', 'Личные устройства разрешены. Подключение — только через администратора.', '⌁'],
  ['Не трогайте оборудование', 'Не отключайте, не перемещайте и не настраивайте технику самостоятельно.', '▣'],
  ['Бережное отношение', 'Не раскачивайтесь на креслах и относитесь к оборудованию аккуратно.', '◇'],
  ['Еда — только в Lounge Zone', 'За игровыми местами есть запрещено. Для этого предусмотрена отдельная зона.', '◌'],
  ['На территории клуба запрещено', 'Употребление алкоголя, насвая и других запрещённых веществ.', '⊘'],
  ['Лицам младше 18 лет запрещено', 'Находиться в клубе после 22:00.', '18+'],
  ['Администрация не несёт', 'Ответственности за оставленные без присмотра личные вещи.', '⌑'],
  ['В случае порчи имущества клуба', 'Причинённый ущерб подлежит возмещению.', '$'],
  ['При нарушении правил администрация', 'Вправе отказать в обслуживании без возврата денежных средств.', '!'],
];

function Logo({small=false}) { return <div className={'logo ' + (small ? 'logo-small' : '')}><span className="logo-mark">B</span><span className="logo-word">BUNKER<small>GAME ZONE</small></span></div> }
function Button({children, secondary=false}) { return <a className={'button ' + (secondary ? 'button-secondary' : '')} href={secondary ? '#pricing' : booking}>{children}<span>→</span></a> }
function SectionHead({eyebrow, title, copy}) { return <div className="section-head"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div> }

function Header() { const [open, setOpen] = useState(false); return <header className="header"><a href="#top"><Logo small /></a><nav className={open ? 'nav-open' : ''}>{[['Зоны','#zones'],['Прайс','#pricing'],['Железо','#hardware'],['Акции','#promo'],['Правила','#rules'],['Контакты','#contacts']].map(([x,y])=><a key={x} href={y} onClick={()=>setOpen(false)}>{x}</a>)}</nav><Button>Забронировать</Button><button className="menu" onClick={()=>setOpen(!open)} aria-label="Меню">{open ? '×' : '☰'}</button></header> }
function Hero() { return <section className="hero" id="top"><div className="hero-photo"/><div className="hero-content"><div className="status"><i/> OPEN 24/7 <span>БИШКЕК · FRUNZE 278</span></div><p className="hero-kicker">WELCOME TO THE UNDERGROUND</p><h1>BUNKER<span>GAME ZONE</span></h1><p className="hero-copy">Твоя игровая зона. Твой ритм.<br/>Твоя победа.</p><div className="hero-actions"><Button>Забронировать место</Button><Button secondary>Смотреть прайс</Button></div></div><div className="hero-note">EST. 2024 <b>01</b></div><div className="scroll">SCROLL <span>↓</span></div></section> }
function Zones() { return <section className="section zones" id="zones"><SectionHead eyebrow="01 / THE ARENA" title="Выбери свою зону" copy="Пять способов играть. Один адрес — BUNKER."/><div className="zone-grid">{zones.map(([name,desc,photo,num])=><article className={'zone-card zone-'+num} key={name} style={{'--bg':`url(${photo})`}}><span className="card-num">{num}</span><div><span className="zone-label">{name}</span><h3>{desc}</h3><a href="#pricing">Подробнее →</a></div></article>)}</div></section> }
function Pricing() { return <section className="section pricing" id="pricing"><SectionHead eyebrow="02 / RATES" title="Прайс-лист" copy="Честные цены. Больше времени на игру."/><div className="price-grid">{prices.map((p)=><article className={'price-card '+p.accent} key={p.title}><div className="price-top"><span>{p.tag}</span><b>↗</b></div><h3>{p.title}</h3>{p.rows.map((r,i)=><div className="price-row" key={i}><span>{r[0]}</span><strong>{r[1]}</strong>{r[2]&&<em>{r[2]}</em>}</div>)}</article>)}</div></section> }
function Hardware() { return <section className="section hardware" id="hardware"><div className="hardware-visual" style={{backgroundImage:`url(${newImg('hardware.png')})`}}><span>SPEC / 01</span><strong>BUILT<br/><i>TO WIN.</i></strong></div><div className="hardware-info"><SectionHead eyebrow="03 / LOADOUT" title="Железо" copy="Каждая станция собрана так, чтобы ты думал только об игре."/><div className="spec-grid">{specs.map(([key,val,sub])=><div className="spec" key={key}><span>{key}</span><strong>{val}</strong><small>{sub}</small></div>)}</div></div></section> }
function Promo() { return <section className="section promo" id="promo"><div className="promo-image" style={{backgroundImage:`url(${newImg('tariff.png')})`}}/><div className="promo-copy"><span className="eyebrow">04 / SPECIAL OFFER</span><p className="promo-label">УТРЕННИЙ</p><h2>ТАРИФ</h2><div className="promo-time">10:00 <span>—</span> 16:00</div><div className="promo-price">400 <small>сом</small></div><p>Выгодное время для игр и побед.<br/>Полный фокус без суеты.</p><Button>Забронировать утро</Button></div></section> }
function Gallery() { const gallery=[newImg('pc.png'),newImg('vr.png'),img(9),newImg('auto.png'),img(3),newImg('tennis.png'),newImg('ps5.png'),newImg('tariff.png'),newImg('hardware.png'),img(14),img(15),img(16)]; const [selected,setSelected]=useState(null); return <section className="section gallery" id="gallery"><SectionHead eyebrow="05 / INSIDE BUNKER" title="Внутри игры" copy="Не просто место. Атмосфера, в которую хочется возвращаться."/><div className="gallery-grid">{gallery.map((source,i)=><button key={source+i} className={'gallery-item gi-'+(i%8)} onClick={()=>setSelected(source)}><img src={source} alt="BUNKER GAME ZONE" loading="lazy"/><span>VIEW →</span></button>)}</div>{selected&&<div className="lightbox" onClick={()=>setSelected(null)}><img src={selected} alt="BUNKER"/><button>×</button></div>}</section> }
function Rules() { return <section className="section rules" id="rules"><SectionHead eyebrow="06 / PLAY FAIR" title="Правила клуба" copy="Уважай пространство — и оно ответит взаимностью."/><div className="rules-grid">{rules.map(([title,copy,icon],i)=><article className="rule" key={title}><strong>{String(i+1).padStart(2,'0')}</strong><div><h3>{title}</h3><p>{copy}</p></div><span>{icon}</span></article>)}</div></section> }
function Contacts() { return <section className="section contacts" id="contacts"><div><SectionHead eyebrow="07 / FIND US" title="До встречи в BUNKER" copy="Заходи на игру, оставайся за атмосферой."/><div className="contact-list"><div><span>АДРЕС</span><strong>Михаила Фрунзе, 278<br/>Бишкек, Кыргызстан</strong></div><div><span>РЕЖИМ</span><strong>Открыты 24/7</strong></div><div><span>INSTAGRAM</span><strong>@bunker.zone.kg</strong></div></div><div className="contact-actions"><Button>Забронировать место</Button><a className="map-link" href="https://2gis.kg/bishkek/geo/70000001114865500" target="_blank" rel="noreferrer">Открыть в 2GIS →</a></div></div><div className="map-art"><iframe title="BUNKER GAME ZONE на карте" src="https://www.google.com/maps?q=%D1%83%D0%BB%D0%B8%D1%86%D0%B0+%D0%A4%D1%80%D1%83%D0%BD%D0%B7%D0%B5%2C+278%2C+%D0%91%D0%B8%D1%88%D0%BA%D0%B5%D0%BA&output=embed" loading="lazy"/><div className="map-shade"/><div className="map-label">BUNKER<br/><small>FRUNZE 278 · БИШКЕК</small></div></div></section> }
function Footer() { return <footer><Logo/><p>GAME HARD. PLAY FAIR.</p><span>© 2027 BUNKER GAME ZONE</span></footer> }
function App(){ useEffect(()=>{const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.08}); document.querySelectorAll('.section').forEach(e=>obs.observe(e)); return()=>obs.disconnect()},[]); return <><Header/><main><Hero/><Zones/><Pricing/><Hardware/><Promo/><Gallery/><Rules/><Contacts/></main><Footer/><div className="mobile-book"><Button>Забронировать место</Button></div></> }
createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>);
