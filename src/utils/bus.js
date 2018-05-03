export default function Bus() {
  this.handlers = [];

  window.addEventListener('message', this._receive.bind(this), false);
}

Bus.prototype.on = function(event, handler) {
  (this.handlers[event] || (this.handlers[event] = [])).push(handler.bind(this));
};

Bus.prototype.emit = function(event, payload, targets) {
  console.log('emit', event);

  targets.forEach(function(target) {
    target.postMessage({
      busEvent: event,
      payload: payload
    }, "*");
  });
};

Bus.prototype._receive = function(e) {
  const event = e.data.busEvent;
  const payload = e.data.payload;

  if (!event) return;

  if (this.handlers[event]) {
    this.handlers[event].forEach((handler) => {
      try {
        handler(payload);
      } catch (e) {
      }
    });
  }
};

// Bus.emit('collect', {}, frames).then(function(results) {
//   console.log(results);
// });

// Bus.on('collect').then(function(callback) {
//   console.log('got collect event');

//   callback({ data: (Math.random() * 1e5 | 0) });
// });

// Bus.prototype._addCallback = function(callback) {
//   if (!callback) return;

//   let id = ++this.callbackId;
//   this.callbacks[id] = callback;

//   return id;
// };

// const promise = new Promise(function(resolve, reject) {
//   const callback = function(data) {
//     resolve(data);
//   };

//   target.postMessage({
//     event: event,
//     payload: payload,
//     callback_id: this._addCallback(callback),
//     channel_id: this.id
//   }, "*");

// }.bind(this));

// return promise;
