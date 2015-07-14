
	var error = (function(){
		var showInConsole = true;

		var _throwError = function(name, message){
			var exception = function(name, message){
				this.name = name;
				this.message = message;
			}

			if (showInConsole) console.log('%c Error >> name: ' + name + ' | message: ' + message, 'background: #bf2603; color: #fff; padding: 2px; font-weight: bold');
			throw new exception(name, message);
		}

		return {
			throw : function(name, message){
				_throwError(name, message);
			}
		}
	}());