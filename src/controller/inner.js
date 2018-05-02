import Channel from '../utils/channel';

function Controller(options) {
  this.channel = new Channel({ label: 'inner_controller' })

  this.channel.on('tokenize', this._tokenize.bind(this));

  this.channel.connect({ target: window.parent });
  this.channel.childReady();
}

Controller.prototype._tokenize = function(data) {
  console.log('inner controller tokenize');
};

new Controller();
