const {execSync} = require('child_process');
const EventEmitter = require('events');

const metrics = {
    aggregated: function () {
        const memoryAmount = metrics.memory.amount();
        const threadsAmount = metrics.threads.amount();
        const listenersAmount = metrics.events.listenersAmount();
        const aggregate = `Memory: ${memoryAmount}, threads: ${threadsAmount}, listeners: ${listenersAmount}`;
        return aggregate;
    },
    memory: {
        amount: function () {
            const amount = process.memoryUsage().heapUsed;
            return amount;
        }
    },
    threads: {
        amount: function () {
            const threadCount = execSync('cat /proc/' + process.pid + '/status | grep -i Threads').toString().trim();
            const amount = parseInt(threadCount.split('\t')[1]);
            return amount;
        }
    },
    events: {
        listenersAmount: function () {
            const amount = EventEmitter.prototype.globalListenerCount;
            return amount;
        }
    }
};

module.exports = function (argument) {
    // Instance magic
    let self = this;
    // Ability to perform periodical checks
    this.periodical = (interval) => {
        this.interval = setInterval(() => {
            if (undefined !== this.check &&
                undefined !== this.checkArguments &&
                undefined !== this.action &&
                undefined !== this.actionArguments) {
                let result = this.check.apply(this, this.checkArguments);
                this.action.apply(result, this.actionArguments);
            }
        }, interval);
        return this;
    };
    // Possible actions to happen when the trigger condition is met
    let triggeredAction = function (result) {
        self.actionArguments = arguments;
        // Do nothing
        this.nothing = function nothing(boundResult) {
            self.action = nothing;
        };
        // Terminate the current process
        this.terminate = function terminate(boundResult) {
            self.action = terminate;
            if (result || boundResult) {
                process.exit();
            }
        };
        this.log = function log(boundResult) {
            self.action = log;
            if ('function' === typeof boundResult) {
                self.actionLogArgument = boundResult;
            }
            if (result || boundResult) {
                if (self.actionLogArgument) {
                    const message = self.actionLogArgument();
                    console.log(message);
                }
            }
        };
        return this;
    };
    // Memory-related limits
    this.memory = function () {
        return {
            // A limit to check that no more than "allowedAmount" memory is used
            moreThan: function moreThan(allowedAmount) {
                self.checkArguments = arguments;
                self.check = moreThan;
                const amount = metrics.memory.amount();
                const result = allowedAmount < amount;
                return triggeredAction(result);
            }
        }
    };
    // Thread-related limits
    this.threads = function () {
        return {
            moreThan: function moreThan(allowedAmount) {
                self.checkArguments = arguments;
                self.check = moreThan;
                const amount = metrics.threads.amount();
                const result = allowedAmount < amount;
                return triggeredAction(result);
            }
        }
    };
    // Event-related limits
    this.events = function () {
        return {
            moreListenersThan: function moreListenersThan(allowedAmount) {
                self.checkArguments = arguments;
                self.check = moreListenersThan;
                const globalListenerCount = EventEmitter.prototype.globalListenerCount;
                if (undefined === globalListenerCount) {
                    EventEmitter.prototype.globalListenerCount = 0;
                    EventEmitter.prototype.onOriginal = EventEmitter.prototype.on;
                    EventEmitter.prototype.on = function () {
                        EventEmitter.prototype.globalListenerCount++;
                        return EventEmitter.prototype.onOriginal.apply(this, arguments);
                    };
                    EventEmitter.prototype.removeListenerOriginal = EventEmitter.prototype.removeListener;
                    EventEmitter.prototype.removeListener = function () {
                        EventEmitter.prototype.globalListenerCount--;
                        return EventEmitter.prototype.removeListenerOriginal.apply(this, arguments);
                    };
                }
                const amount = metrics.events.listenersAmount();
                const result = allowedAmount < amount;
                return triggeredAction(result);
            }
        }
    };
};
module.exports.metrics = metrics;
