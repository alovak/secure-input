import Channel from '../utils/channel';
import Bus from '../utils/bus';

function Controller(options) {
  this.channel = new Channel({ label: 'inner_controller' })

  this.channel.on('tokenize', this._tokenize.bind(this));

  this.channel.connect({ target: window.parent });
  this.channel.childReady();
}

Controller.prototype._tokenize = function(framesIds) {
  console.log('inner controller tokenize for elements', framesIds);

  const bus = new Bus();

  bus.on('collect', function(data, callback) {
    console.log('collect promise called', data);

    if (!callback) return;

    console.log('we have callback, lets call it back');

    data.number++;

    callback(data);
  });

  bus.emit('collect', { number: 1 }, [window], function(data) { console.log('got data back', data) });
  bus.emit('collect', { number: 5 }, [window], function(data) { console.log('got data back', data) });
  bus.emit('collect', { number: 10 }, [window], function(data) { console.log('got data back', data) });

  bus.emit('collect', { number: 10 }, [window]).then(function(data) {
    console.log('got data back', data)
  });

  framesIds.forEach(function(frameId) {
    let target = window.parent.frames[frameId];
    console.log('send message to frame/target');

    this.channel.send('hi', { name: 'John' }, target).then(function(data) {
      console.log('hello', data[hello]);
    });
  }.bind(this));
};

new Controller('one');

