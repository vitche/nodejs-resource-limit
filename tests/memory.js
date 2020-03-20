let ResourceLimit = require('../main');

new ResourceLimit()
    .memory()
    .moreThan(25700000)
    .terminate();

new ResourceLimit()
    .periodical(500)
    .memory()
    .moreThan(100000)
    .nothing();

/*
new ResourceLimit()
    .periodical(5000)
    .memory()
    .moreThan(900000)
    .memorySnapshotLog(false, 400000);
 */

new ResourceLimit()
    .periodical(2000)
    .memory()
    .moreThan(87000000)
    .terminate();
