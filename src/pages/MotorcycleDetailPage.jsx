import { useEffect, useRef, useState } from 'react';
import CatalogCard from '../components/catalog/CatalogCard';
import { labels } from '../data/catalogLabels';

const formatNumber = (value) => new Intl.NumberFormat('ru-RU').format(Math.round(Number(value) || 0));
const price = (bike) => `${bike.currency === 'USD' ? '$' : '¥'} ${formatNumber(bike.estimatedKyrgyzstanPrice)}`;

function Gallery({ bike }) {
  const images = bike.images?.filter(Boolean) || [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!lightbox) return undefined;
    document.body.classList.add('lightbox-is-open');
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightbox(false);
      if (event.key === 'ArrowRight') setActive((value) => (value + 1) % images.length);
      if (event.key === 'ArrowLeft') setActive((value) => (value - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('lightbox-is-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox, images.length]);

  const move = (direction) => setActive((value) => (value + direction + images.length) % images.length);
  const onTouchEnd = (event) => {
    if (touchStart === null || images.length < 2) return;
    const delta = touchStart - event.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) move(delta > 0 ? 1 : -1);
    setTouchStart(null);
  };

  return <div className="detail-gallery-new"><div className="detail-gallery-main" onTouchStart={(event) => setTouchStart(event.touches[0].clientX)} onTouchEnd={onTouchEnd}><button type="button" onClick={() => setLightbox(true)} aria-label="Открыть фотографию на весь экран"><img src={images[active]} alt={`${bike.brand} ${bike.model}, ${bike.year}`} /></button>{images.length > 1 && <><button className="gallery-control gallery-prev" type="button" onClick={() => move(-1)} aria-label="Предыдущее фото">←</button><button className="gallery-control gallery-next" type="button" onClick={() => move(1)} aria-label="Следующее фото">→</button></>}</div><div className="detail-gallery-meta"><span>MOTORCYCLE GALLERY · {active + 1}/{images.length}</span><span>Нажмите для увеличения</span></div><div className="detail-thumbs" role="tablist" aria-label="Фотографии мотоцикла">{images.map((image, index) => <button type="button" role="tab" aria-selected={active === index} className={active === index ? 'is-active' : ''} key={image} onClick={() => setActive(index)}><img src={image} alt={`${bike.brand} ${bike.model}, фото ${index + 1}`} /></button>)}</div>{lightbox && <div className="detail-lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={() => setLightbox(false)}><button ref={closeRef} className="detail-lightbox-close" type="button" onClick={() => setLightbox(false)} aria-label="Закрыть просмотр">×</button><img src={images[active]} alt={`${bike.brand} ${bike.model}, увеличенное фото`} onClick={(event) => event.stopPropagation()} /></div>}</div>;
}

function DetailSkeleton() {
  return <main className="page detail-page detail-loading"><div className="detail-skeleton-grid"><div className="detail-skeleton-image"/><div><div className="detail-skeleton-line wide"/><div className="detail-skeleton-line short"/><div className="detail-skeleton-copy"/></div></div></main>;
}

export default function MotorcycleDetailPage({ id, Layout, Eyebrow, Button, Icon, navigate, repository, ApplicationForm }) {
  const [bike, setBike] = useState(null);
  const [related, setRelated] = useState([]);
  const [state, setState] = useState('loading');

  const load = () => {
    setState('loading');
    Promise.all([repository.getById(id), repository.list()]).then(([item, all]) => {
      if (!item) { setState('not-found'); return; }
      setBike(item);
      setRelated(all.filter((candidate) => candidate.id !== item.id && candidate.type === item.type).slice(0, 3));
      setState('success');
    }).catch(() => setState('error'));
  };
  useEffect(() => { load(); }, [id]);

  if (state === 'loading') return <Layout><DetailSkeleton /></Layout>;
  if (state === 'error') return <Layout><main className="page detail-state"><Eyebrow>INVENTORY ERROR</Eyebrow><h1>Не удалось загрузить мотоцикл.</h1><button className="button" type="button" onClick={load}>Попробовать ещё раз <Icon/></button></main></Layout>;
  if (state === 'not-found' || !bike) return <Layout><main className="page detail-state"><Eyebrow>404 · INVENTORY</Eyebrow><h1>Мотоцикл не найден.</h1><Button href="/catalog">Вернуться в каталог</Button></main></Layout>;

  return <Layout><main className="page detail-page"><div className="detail-breadcrumb"><a href="/catalog" onClick={(event) => { event.preventDefault(); navigate('/catalog'); }}>← Каталог</a><span>/</span><span>{bike.brand} / {bike.model}</span></div><section className="detail-product"><Gallery bike={bike}/><div className="detail-identity"><Eyebrow>{bike.brand} · {bike.type}</Eyebrow><span className="detail-meta-label">JAPAN SELECTION</span><h1>{bike.model}<small>{bike.year}</small></h1><p className="detail-description">{bike.description}</p><div className="detail-price-new"><span>ОРИЕНТИРОВОЧНАЯ ЦЕНА В КЫРГЫЗСТАНЕ</span><strong>{price(bike)}</strong><small>Цена на текущем этапе. Точная стоимость определяется после подтверждения параметров и доставки.</small></div><div className="detail-status"><i/> {labels[bike.status] || bike.status}</div><div className="detail-actions-new"><a className="button" href="#request">Запросить этот мотоцикл <Icon/></a><Button href={`/calculator?bike=${bike.id}`} variant="ghost">Рассчитать полную стоимость</Button></div></div></section><section className="detail-spec-section"><div className="detail-section-kicker">01 · TECHNICAL PROFILE</div><div className="detail-spec-grid-new"><div><span>Двигатель</span><strong>{bike.engineCc} см³</strong></div><div><span>Пробег</span><strong>{formatNumber(bike.mileage)} км</strong></div><div><span>Год</span><strong>{bike.year}</strong></div><div><span>Состояние</span><strong>{bike.condition}</strong></div><div><span>Тип</span><strong>{bike.type}</strong></div><div><span>Валюта</span><strong>{bike.currency}</strong></div></div></section><section className="detail-auction-section"><div><div className="detail-section-kicker">02 · JAPAN AUCTION</div><h2>Откуда<br/><span>начинается проверка.</span></h2><p>Информация о подборе. Источник и параметры лота подтверждаются перед участием в торгах.</p></div><div className="auction-facts-new"><div><span>Локация</span><strong>{bike.auctionLocation || 'Japan'}</strong></div><div><span>Статус</span><strong>{labels[bike.status] || bike.status}</strong></div><div><span>ID мотоцикла</span><strong>#{bike.id}</strong></div><div><span>Источник</span><strong>JAPAN AUCTION</strong></div></div></section><section className="detail-sheet-section"><div className="detail-section-kicker">03 · AUCTION SHEET</div><div className="detail-sheet-layout"><div className="detail-sheet-visual"><img src="/assets/auction-sheet.svg" alt="Японский аукционный лист" /></div><div><h2>Проверяем<br/><span>до ставки.</span></h2><p>Аукционный лист является частью проверки. Документ предоставляется после получения подтверждённых данных по лоту.</p><div className="sheet-facts-new"><div><span>Оценка</span><strong>—</strong></div><div><span>Пробег</span><strong>{formatNumber(bike.mileage)} км</strong></div><div><span>Состояние</span><strong>{bike.condition}</strong></div><div><span>Документы</span><strong>Уточняются</strong></div></div></div></div></section><section className="detail-trust-section"><div><div className="detail-section-kicker">04 · TRANSPARENCY</div><h2>Что мы<br/><span>проверяем.</span></h2></div><div className="trust-list-new">{[['01','Состояние','Изучаем описание и фотографии лота.'],['02','Пробег','Сверяем пробег с доступными документами.'],['03','Документы','Проверяем наличие информации до ставки.'],['04','Повреждения','Фиксируем замечания инспекции.']].map(([number, title, text]) => <div key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div></section><section className="detail-delivery-section"><div className="detail-section-kicker">05 · DELIVERY ROUTE</div><div className="delivery-route-new">{['JAPAN','AUCTION','PURCHASE','SHIPPING','BISHKEK'].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < 4 && <i/>}</div>)}</div></section><section id="request" className="detail-request-section"><div><div className="detail-section-kicker">06 · REQUEST</div><h2>Этот мотоцикл<br/><span>может быть вашим.</span></h2><p>Заявка автоматически привязана к выбранной модели.</p></div><ApplicationForm bike={bike}/></section>{related.length > 0 && <section className="detail-related"><div className="detail-section-kicker">MORE FROM INVENTORY</div><div className="detail-related-head"><h2>Похожие<br/><span>мотоциклы.</span></h2><Button href="/catalog" variant="ghost">Весь каталог</Button></div><div className="inventory-grid">{related.map((item) => <CatalogCard key={item.id} bike={item} onOpen={(itemId) => navigate(`/catalog/${itemId}`)} />)}</div></section>}<div className="detail-mobile-cta"><a className="button" href="#request">Запросить мотоцикл <Icon/></a></div></main></Layout>;
}
