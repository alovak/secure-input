import Channel from '../utils/channel';
import Bus from '../utils/bus';
import Config from '../config';

function Controller(options) {
  this.channel = new Channel({ label: 'inner_controller' })
  this.bus = new Bus();

  this.channel.on('tokenize', this._tokenize.bind(this));

  this.channel.connect({ target: window.parent });
  this.channel.childReady();

}

Controller.prototype._tokenize = function(framesIds, callback) {
  const frames = framesIds.map(function(index) { return window.parent.frames[index] });

  this.bus.emit('collect', {}, frames).then(function(data) {
    let card = {};
    data.forEach(function(d) { Object.assign(card, d) });

    if (callback) this._createToken(card).then(function(token) {
      callback(token)
    });
  }.bind(this));
};

Controller.prototype._createToken = function(card) {
  return fetch(Config.apiUrl + '/tokens', {
    method: 'POST',
    body: JSON.stringify({ card: card }),
    headers: {
      'Content-type': 'application/json'
    }
  }).then(function(response) {
    return new Promise(function(resolve, reject) {
      if (response.ok) resolve(response.json());
    });
  });
};

new Controller();

