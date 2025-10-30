export const getDashboardMetrics = () => ({
  calories: {
    burned: [
      { x: "Lun", y: 700 },
      { x: "Mar", y: 850 },
      { x: "Mié", y: 900 },
      { x: "Jue", y: 750 },
      { x: "Vie", y: 950 },
      { x: "Sáb", y: 1100 },
      { x: "Dom", y: 800 },
    ],
    consumed: [
      { x: "Lun", y: 1000 },
      { x: "Mar", y: 1200 },
      { x: "Mié", y: 1300 },
      { x: "Jue", y: 1250 },
      { x: "Vie", y: 1400 },
      { x: "Sáb", y: 1500 },
      { x: "Dom", y: 1200 },
    ],
  },
  activity: [
    { x: "Pasos", y: 1200 },
    { x: "Bici", y: 700 },
    { x: "Yoga", y: 400 },
    { x: "Fuerza", y: 1000 },
    { x: "Dormir", y: 1300 },
  ],
  heartRate: [
    { x: "6AM", y: 60 },
    { x: "9AM", y: 72 },
    { x: "12PM", y: 80 },
    { x: "3PM", y: 75 },
    { x: "6PM", y: 78 },
    { x: "9PM", y: 70 },
  ],
  environment: [
    { x: "Temp", y: 25 },
    { x: "Amb", y: 22 },
    { x: "Humedad", y: 50 },
    { x: "Aire", y: 40 },
    { x: "UV", y: 70 },
  ],
});