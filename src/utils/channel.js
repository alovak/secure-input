export default function Channel(options) {
  this.label = options.label;
  this.id = options.id || (Math.random() * 1e10 | 0);

  this.handlers = [];
  this.outgoingQueue = [];
  this.incomingQueue = [];
  this.isReady = false;
  this.isTargetReady = false;
  this.callbacks = {};
  this.callbackId = 1;

  this.on('childReady', function(data) {
    this.id = data.channel_id;
    this.isTargetReady = true;
    this._processQueue(this.outgoingQueue);
  }.bind(this));

  window.addEventListener('message', this._receive.bind(this), false)
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
  }.bind(this), 5000);
};

Channel.prototype.on = function(event, handler) {
  (this.handlers[event] || (this.handlers[event] = [])).push(handler.bind(this));
};

Channel.prototype.say = function(event, payload = {}, callback) {
  this._send(event, payload, callback);
};

Channel.prototype._receive = function(e) {

  const fn = function() {
    this._handleEvent(e);
  }.bind(this);

  this.incomingQueue.push(fn);

  if (this.isReady) {
    this._processQueue(this.incomingQueue);
  }
};

Channel.prototype._handleEvent = function(e) {
  const event = e.data.event;
  const payload = e.data.payload;
  const callbackId = e.data.callbackId;
  const source = e.source;

  if (e.source !== this.target || !event) return;

  if (event === 'callback') {
    this.callbacks[callbackId](payload);
    delete this.callbacks[callbackId];
    return;
  }

  let callback;

  if (callbackId) {
    callback = function(data) {
      source.postMessage({
        event: 'callback',
        payload: data,
        callbackId: callbackId
      }, '*');
    };
  }

  if (this.handlers[event]) {
    this.handlers[event].forEach((handler) => {
      try {
        handler(payload, callback);
      } catch (e) {
      }
    });
  }
};

Channel.prototype._addCallback = function(callback) {
  const callbackId = this.callbackId++;
  this.callbacks[callbackId] = callback;
  return callbackId;
};

Channel.prototype._send = function(event, payload, callback) {
  const fn = function() {
    this.target.postMessage({
      event: event,
      payload: payload,
      callbackId: callback ? this._addCallback(callback) : null,
      channel_id: this.id
    }, "*");
  }.bind(this);

  this.outgoingQueue.push(fn);

  if (this.target && this.isTargetReady) {
    this._processQueue(this.outgoingQueue);
  }
};

Channel.prototype._processQueue = function(queue) {
  while (queue.length > 0) {
    (queue.shift())();   
  }
};

Channel.prototype.parentReady = function() {
  this.isReady = true;
}

Channel.prototype.childReady = function() {
  this.isReady = true;
  this.isTargetReady = true;
  this.say('childReady', { channel_id: this.id });
}

// Channel.prototype.ready = function() {
//   this.isReady = true;
// };
