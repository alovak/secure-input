export default function IFrame(options) {
  this.options = options || {};

  const iframe = document.createElement('iframe');
  iframe.name = options.name;
  iframe.id = options.id;
  iframe.src = (options.rnd && (options.src + "?rnd=" + (Math.random() * 1e5 | 0) )) || options.src;

  iframe.height = options.height || '1px';
  iframe.frameborder = '0';
  iframe.allowTransparency = 'true';
  iframe.scrolling = "no";

  iframe.setAttribute('style', [
    'border:0',
    'margin:0',
    'padding:0',
    'background:transparent',
    'display:block',
    'width: 1px',
    'min-width: 100%',
    'overflow: hidden',
    ''
  ].join('!important;'));

  return iframe;
}
