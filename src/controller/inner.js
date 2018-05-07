import Channel from '../utils/channel';
import Bus from '../utils/bus';

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

    if (callback) this._createToken(card, callback);
  }.bind(this));
};

Controller.prototype._createToken = function(card, callback) {
  // send request to API
  // and then return token to callback
  const token = {
    id: 'tok_' + (Math.random() * 1e10 | 0),
    object: 'token',
    used: false,
    type: 'card',
    card: {
      id: 'card_' + (Math.random() * 1e10 | 0),
      brand: 'visa',
      last4: '4242',
      exp_month: 1,
      exp_year: 2020,
      country: 'US',
      holder: null
    }
  }

  callback(token);
};

new Controller();

