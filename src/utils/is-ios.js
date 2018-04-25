export default function isIos() {
  console.log(navigator.userAgent);
  return /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
};
