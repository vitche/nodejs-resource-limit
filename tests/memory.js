let ResourceLimit = require('../main');

new ResourceLimit()
    .memory()
    .moreThan(2570000)
    .terminate();

new ResourceLimit()
    .periodical(500)
    .memory()
    .moreThan(100000)
    .nothing();

new ResourceLimit()
    .periodical(2000)
    .memory()
    .moreThan(2700000)
    .terminate();
