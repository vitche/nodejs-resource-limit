let ResourceLimit = require('../main');

new ResourceLimit()
    .periodical(1000)
    .countDown()
    .to(5)
    .terminate();
