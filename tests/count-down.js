let ResourceLimit = require('../main');

new ResourceLimit()
    .periodical(1000)
    .countDown()
    .to(4)
    .execute(() => {
        console.log(":)");
    });

new ResourceLimit()
    .periodical(1000)
    .countDown()
    .to(5)
    .terminate();
