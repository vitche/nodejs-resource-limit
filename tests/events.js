const EventEmitter = require('events');
let ResourceLimit = require('../main');

// "console.log" creates 2 listeners
new ResourceLimit()
    .periodical(500)
    .events()
    .moreListenersThan(5 + 3)
    .terminate();

// "console.log" creates 2 listeners
new ResourceLimit()
    .periodical(500)
    .events()
    .moreListenersThan(3 + 3)
    .log(() => ResourceLimit.metrics.aggregated());

let emitter = new EventEmitter();

emitter.on('message.3', function () {
});
emitter.on('message.4', function () {
});
let listener5 = function () {
};
emitter.on('message.5', listener5);
let listener6 = function () {
};
emitter.on('message.6', listener6);
let listener7 = function () {
};
emitter.on('message.7', listener7);
emitter.removeListener('message.5', listener5);
emitter.removeListener('message.6', listener6);
emitter.removeListener('message.7', listener7);
emitter.on('message.0', function () {
});
emitter.on('message.1', function () {
});
emitter.on('message.2', function () {
});
emitter.emit('message.1');
emitter.emit('message.3');
emitter.emit('message.7');
