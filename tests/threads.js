let ResourceLimit = require('../main');

new ResourceLimit()
    .periodical(500)
    .threads()
    .moreThan(8)
    .terminate();
