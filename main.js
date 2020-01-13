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
	}
	// Possible actions to happen when the trigger condition is met
	let triggeredAction = function(result) {
		self.actionArguments = arguments;
		// Do nothing
		this.nothing = function nothing(boundResult) {
			self.action = nothing;
		}
		// Terminate the current process
		this.terminate = function terminate(boundResult) {
			self.action = terminate;
			if (result || boundResult) {
				process.exit();
			}
		};
		return this;
	};
	// Memory-related limits
	this.memory = function() {
		return {
			// A limit to check that no more than "allowedAmount" memory is used
			moreThan: function moreThan(allowedAmount) {
				self.checkArguments = arguments;
				self.check = moreThan;
				const amount = process.memoryUsage().heapUsed;
				const result =  allowedAmount < amount;
				console.log("Resource limit, memory: " + allowedAmount  + "?<" + amount);
				return triggeredAction(result);
			}
		}
	}
};