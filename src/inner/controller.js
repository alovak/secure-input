import element from './element';
import channel from '../channel';

function controller() {
  const id = window.name;
  const chan = new channel();
  const el = new element({ channel: chan, id: id });

  chan.connect({ target: window.parent, id: id, label: id });
  chan.ready();

  window.addEventListener('blur', function() {
    chan.say('blur');
  });
}

controller();
