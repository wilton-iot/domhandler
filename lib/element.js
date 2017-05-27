define(function(){var require = WILTON_requiresync;var module = {exports: {}};var exports = module.exports;
// DOM-Level-1-compliant structure
var NodePrototype = require('domhandler/lib/node');
var ElementPrototype = module.exports = Object.create(NodePrototype);

var domLvl1 = {
	tagName: "name"
};

Object.keys(domLvl1).forEach(function(key) {
	var shorthand = domLvl1[key];
	Object.defineProperty(ElementPrototype, key, {
		get: function() {
			return this[shorthand] || null;
		},
		set: function(val) {
			this[shorthand] = val;
			return val;
		}
	});
});

return module.exports;});
