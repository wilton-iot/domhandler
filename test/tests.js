define(function(){var require = WILTON_requiresync;var module = {exports: {}};var exports = module.exports;
var test = require("tape-compat");
var it = test.it;
var assert = require("assert"),
    util = require("util"),
    Parser = require("htmlparser2").Parser,
    Handler = require("domhandler/"),    
    fs = require("wilton/fs"),
    misc = require("wilton/misc"),
    forEach = require("lodash/forEach");

var basePath = misc.getWiltonConfig().requireJsConfig.baseUrl + "/domhandler/test/cases/";
var list = fs.listDirectory({ path: basePath });

forEach(list, function(path){
        var testJson = fs.readFile({ path: basePath + path });
        var test = JSON.parse(testJson);
	it(test.name, function(){
		var expected = test.expected;

		var handler = new Handler(function(err, actual){
			assert.ifError(err);
			try {
				compare(expected, actual);
			} catch(e){
//				e.expected = util.inspect(expected, inspectOpts);
//				e.actual   = util.inspect(actual,   inspectOpts);
				throw e;
			}
		}, test.options);

		var data = test.html;

		var parser = new Parser(handler, test.options);

		//first, try to run the test via chunks
		if (test.streaming || test.streaming === undefined){
			for(var i = 0; i < data.length; i++){
				parser.write(data.charAt(i));
			}
			parser.done();
		}

		//then parse everything
		parser.parseComplete(data);
	});
});

function compare(expected, result){
	assert.equal(typeof expected, typeof result, "types didn't match");
	if(typeof expected !== "object" || expected === null){
		assert.strictEqual(expected, result, "result doesn't equal expected");
	} else {
		for(var prop in expected){
			assert.ok(prop in result, "result didn't contain property " + prop);
			compare(expected[prop], result[prop]);
		}
	}
}

return module.exports;});
