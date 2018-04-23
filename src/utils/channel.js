// Here is a way on how to use Channel
//
//   channel = new Channel({ label: 'iframe' });
//
// for debugg purposes you can
//
//   channel.ping();
//
// when your target is create (iframe was added to document)
// you have to connect. Connecting means you can send messages
// to target.
//
//   channel.connect({ target: window.parent });
//
// When you ready to enable all added handlers:
//
// channel.ready();
export default function Channel(options) {
  this.label = options.label;
  this.id = options.id || (Math.random() * 1e10 | 0);

  this.handlers = [];
  this.outgoingQueue = [];
  this.incomingQueue = [];
  this.isReady = false;
  this.targetReady = false;
  this.isHandShaked = false;

  window.addEventListener('message', this._receive.bind(this), false)

  this.handShakeIntervalId = window.setInterval(function() {
    console.log('say handShake', this.label, this.id);
    this.say('handShake', { channel_id: this.id });
  }.bind(this), 100);

  this.on('handShake', function(data) {
    console.log('receive handShake', this.label, 'id', this.id, 'channel_id', data.channel_id);

    if (this.isHandShaked) return;

    if (data.channel_id === this.id) {
      this.isHandShaked = true;

      clearInterval(this.handShakeIntervalId);

      this.say('handShake', { channel_id: this.id });
    } else if (data.channel_id > this.id) {
      this.id = data.channel_id;
    }
  });
}

Channel.prototype.connect = function(options) {
  this.target = options.target;
};

Channel.prototype.ping = function() {
  this.on('ping', function() {
    console.log('pong', this.label, this.id);
  });

  window.setInterval(function() {
    this.say('ping');
  }.bind(this), 1000);
};

Channel.prototype.on = function(event, handler) {
  (this.handlers[event] || (this.handlers[event] = [])).push(handler.bind(this));
};

Channel.prototype.say = function(event, payload = {}) {
  this._send(event, payload);
};

Channel.prototype._receive = function(e) {
  const fn = function() {
    this._handleEvent(e);
  }.bind(this);

  this.incomingQueue.push(fn);

  if (this.isReady) {
    while (this.incomingQueue.length > 0) {
      (this.incomingQueue.shift())();   
    }
  }
};

Channel.prototype._handleEvent = function(e) {
  const event = e.data.event;
  const payload = e.data.payload;
  const channel_id = e.data.channel_id;

  if ((event === 'handShake' || this.id === channel_id) && this.handlers[event]) {
    this.handlers[event].forEach((handler) => {
      try {
        handler(payload);
      } catch (e) {
      }
    });
  }
};

Channel.prototype._send = function(event, payload) {
  const fn = function() {
    this.target.postMessage({
      event: event,
      payload: payload,
      channel_id: this.id
    }, "*");
  }.bind(this);

  if (event === 'handShake' && this.target) {
    fn();
    return;
  }

  this.outgoingQueue.push(fn);

  if (this.target && this.isHandShaked) {
    while (this.outgoingQueue.length > 0) {
      (this.outgoingQueue.shift())();   
    }
  }
};

Channel.prototype.ready = function() {
  this.isReady = true;
};
