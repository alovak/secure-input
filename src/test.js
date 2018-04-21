import channel from './utils/channel';
import iframe from './utils/iframe';

const chan = new channel()

chan.ping();

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

if (inIframe()) {
} else {
  window.addEventListener('DOMContentLoaded', inParent);
}

function inParent() {
  const container = document.getElementById('container');
  const iframeEl = new iframe({ src: '/conn-iframe.html', rnd: true, height: '100px' });
  container.appendChild(iframeEl);
}
