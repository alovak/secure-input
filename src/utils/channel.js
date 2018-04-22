export default function Channel(options) {
  window.addEventListener('message', this._receive.bind(this), false)

  this.label = options.label;
  this.id = options.id || (Math.random() * 1e9 | 0);

  this.handlers = [];
  this.outgoingQueue = [];
  this.incomingQueue = [];
  this.isReady = false;
  this.targetReady = false;
}

Channel.prototype.connect = function(options) {
  this.target = options.target;
};

Channel.prototype.ping = function() {
  this.on('ping', function() {
    console.log('pong', this.label);
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

  if (this.handlers[event]) {
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
      payload: payload
    }, "*");
  }.bind(this);

  this.outgoingQueue.push(fn);

  if (this.target) {
    while (this.outgoingQueue.length > 0) {
      (this.outgoingQueue.shift())();   
    }
  }
};

Channel.prototype.ready = function() {
  this.isReady = true;
};
