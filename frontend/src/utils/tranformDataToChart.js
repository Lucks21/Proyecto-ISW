const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
];

export const transformData = (data, total) => {
  return Object.keys(data).map((key, index) => {
    const value = data[key];
    const percentage = ((value / total) * 100).toFixed(1);
    return {
      name: key,
      value,
      percentage,
      fill: COLORS[index % COLORS.length],
    };
  });
};
