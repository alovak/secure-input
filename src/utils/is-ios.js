export default function isIos() {
  return /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
};
