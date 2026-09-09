import { useEffect, useMemo, useState } from 'react';
import { calculateEstimate, calculatorConfig } from '../config/calculator';

const format = (value) => new Intl.NumberFormat('ru-RU').format(Math.round(Number(value) || 0));
const inputKeys = [
  ['auctionFee', 'Аукционный сбор'],
  ['japanDelivery', 'Доставка по Японии'],
  ['freight', 'Морская доставка'],
  ['customs', 'Таможенные расходы'],
  ['kyrgyzDelivery', 'Доставка до Бишкека'],
  ['serviceFee', 'Комиссия сервиса'],
];

export default function CalculatorExperience({ Layout, Eyebrow, Button, Icon, repository }) {
  const [bikes, setBikes] = useState([]);
  const [selectedId, setSelectedId] = useState(new URLSearchParams(window.location.search).get('bike') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [values, setValues] = useState({ bikePrice: '', ...calculatorConfig });

  useEffect(() => {
    repository.list().then((items) => setBikes(items)).catch(() => setError(true)).finally(() => setLoading(false));
  }, [repository]);

  const selected = bikes.find((bike) => bike.id === selectedId) || null;
  useEffect(() => {
    if (selected) setValues((current) => ({ ...current, bikePrice: selected.auctionPrice }));
  }, [selected]);

  const result = useMemo(() => calculateEstimate(values, calculatorConfig), [values]);
  const fieldErrors = useMemo(() => Object.fromEntries(Object.entries(values).filter(([key, value]) => key !== 'usdKgs' && (value === '' || Number(value) < 0)).map(([key]) => [key, 'Введите значение не меньше 0'])), [values]);
  const setValue = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const reset = () => setValues({ bikePrice: selected?.auctionPrice || '', ...calculatorConfig });

  return <Layout><main className="page calculator-page-new"><div className="calculator-intro-new"><Eyebrow>TRANSPARENT PRICING</Eyebrow><h1>Калькулятор<br/><span>стоимости.</span></h1><p>Рассчитайте ориентировочную стоимость мотоцикла с доставкой в Кыргызстан.</p></div>{loading && <div className="calculator-loading"><div/><div/></div>}{error && <div className="calculator-state"><h2>Не удалось загрузить мотоциклы.</h2><p>Попробуйте обновить страницу или открыть каталог.</p></div>}{!loading && !error && <section className="calculator-tool"><div className="calculator-input-panel"><div className="calculator-panel-head"><div><span className="calculator-kicker">01 · PARAMETERS</span><h2>Соберите расчёт</h2></div><button type="button" className="calculator-reset" onClick={reset}>Сбросить</button></div><label className="calculator-select-label">Мотоцикл<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}><option value="">Выберите мотоцикл</option>{bikes.map((bike) => <option value={bike.id} key={bike.id}>{bike.brand} {bike.model} · {bike.year}</option>)}</select></label>{!selected && <div className="calculator-empty"><strong>Покажите мотоцикл из каталога</strong><span>Выберите модель, чтобы увидеть её ориентировочную стоимость.</span><Button href="/catalog" variant="ghost">Открыть каталог</Button></div>}{selected && <><div className="calculator-selected-bike"><img src={selected.images?.[0]} alt={`${selected.brand} ${selected.model}`} /><div><span>{selected.brand}</span><strong>{selected.model}</strong><small>{selected.year} · {selected.engineCc} см³ · {selected.currency}</small></div></div><div className="calculator-fields"><div className="calculator-field"><label htmlFor="bike-price">Цена мотоцикла</label><div><input id="bike-price" type="number" min="0" inputMode="decimal" value={values.bikePrice} onChange={(event) => setValue('bikePrice', event.target.value)} aria-invalid={Boolean(fieldErrors.bikePrice)} /><span>USD</span></div>{fieldErrors.bikePrice && <small>{fieldErrors.bikePrice}</small>}</div>{inputKeys.map(([key, label]) => <div className="calculator-field" key={key}><label htmlFor={`calc-${key}`}>{label}</label><div><input id={`calc-${key}`} type="number" min="0" inputMode="decimal" value={values[key]} onChange={(event) => setValue(key, event.target.value)} aria-invalid={Boolean(fieldErrors[key])} /><span>USD</span></div>{fieldErrors[key] && <small>{fieldErrors[key]}</small>}</div>)}</div><p className="calculator-config-note">Коэффициенты можно изменить в настройках перед подключением CMS/API слоя.</p></>}</div>{selected && <aside className="calculator-result-panel"><div className="calculator-kicker">02 · ESTIMATE BREAKDOWN</div><span className="calculator-result-label">Ориентировочная стоимость</span><strong className="calculator-total">$ {format(result.totalUsd)}</strong><div className="calculator-total-kgs"><span>Ориентировочно в кыргызских сомах</span><strong>{format(result.totalKgs)} сом</strong><small>Курс: {format(result.exchangeRate)} USD/KGS</small></div><div className="calculator-breakdown-new">{result.lineItems.map(([label, value]) => <div key={label}><span>{label}</span><b>$ {format(value)}</b></div>)}<div className="calculator-breakdown-total"><span>Итого</span><b>$ {format(result.totalUsd)}</b></div></div><p className="calculator-warning">Предварительный расчёт. Итоговая стоимость зависит от фактической цены покупки, логистики и таможенных расходов.</p><Button href="/contacts">Оставить заявку <Icon/></Button><Button href="/catalog" variant="ghost">Смотреть мотоциклы</Button></aside>}</section>}</main></Layout>;
}
