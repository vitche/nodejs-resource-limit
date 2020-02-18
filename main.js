const EventEmitter = require('events');

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
            if (result || boundResult) {
                console.log(':)');
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
                const amount = process.memoryUsage().heapUsed;
                const result = allowedAmount < amount;
                console.log("Resource limit, memory: " + allowedAmount + "?<" + amount);
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
                const amount = EventEmitter.prototype.globalListenerCount;
                const result = allowedAmount < amount;
                console.log("Resource limit, event listeners: " + allowedAmount + "?<" + amount);
                return triggeredAction(result);
            }
        }
    };
};
