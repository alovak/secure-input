import Channel from '../utils/channel';
import IFrame from '../utils/iframe';

var channel;

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

if (inIframe()) {
  channel = new Channel({ label: 'iframe' });
  channel.ping();
  channel.connect({ target: window.parent });
  channel.ready();
} else {
  channel = new Channel({ label: 'parent' });
  channel.ping();
  window.addEventListener('DOMContentLoaded', inParent);
}

function inParent() {
  const container = document.getElementById('container');
  const iframeEl = new iframe({ src: '/conn-iframe.html', rnd: true, height: '100px' });
  container.appendChild(iframeEl);
  channel.connect({ target: iframeEl.contentWindow });
  channel.ready();
}
