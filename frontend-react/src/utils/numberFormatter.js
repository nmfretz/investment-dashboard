export default function numberFormatter(num) {
  const regex = /\.0$/;
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(regex, "") + "M";
  }
  if (num >= 10000) {
    return (num / 1000).toFixed(1).replace(regex, "") + "K";
  }
  return num;
}
