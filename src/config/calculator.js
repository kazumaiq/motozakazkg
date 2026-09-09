export const calculatorConfig = {
  auctionFee: 15000,
  japanDelivery: 18000,
  freight: 65000,
  customs: 45000,
  kyrgyzDelivery: 12000,
  serviceFee: 35000,
  usdKgs: 89,
};

export const calculateEstimate = ({ bikePrice = 0, ...costs }, config = calculatorConfig) => {
  const lineItems = [
    ['Цена мотоцикла', Number(bikePrice) || 0],
    ['Аукционный сбор', Number(costs.auctionFee) || 0],
    ['Доставка по Японии', Number(costs.japanDelivery) || 0],
    ['Морская доставка', Number(costs.freight) || 0],
    ['Таможенные расходы', Number(costs.customs) || 0],
    ['Доставка до Бишкека', Number(costs.kyrgyzDelivery) || 0],
    ['Комиссия сервиса', Number(costs.serviceFee) || 0],
  ];
  const totalUsd = lineItems.reduce((sum, [, value]) => sum + value, 0);
  return { lineItems, totalUsd, totalKgs: totalUsd * Number(config.usdKgs || 0), exchangeRate: config.usdKgs };
};
