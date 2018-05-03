import Channel from '../utils/channel';
import Bus from '../utils/bus';

function Controller(options) {
  this.channel = new Channel({ label: 'inner_controller' })

  this.channel.on('tokenize', this._tokenize.bind(this));

  this.channel.connect({ target: window.parent });
  this.channel.childReady();
}

Controller.prototype._tokenize = function(framesIds) {
  const bus = new Bus();
  const frames = framesIds.map(function(index) { return window.parent.frames[index] });

  bus.emit('collect', {}, frames).then(function(data) {
    let card = {};
    data.forEach(function(d) { Object.assign(card, d) });

    console.log('got data back in then', card)
  });
};

new Controller();

