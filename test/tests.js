define(function(localRequire, exports, module) { var requireOrig = require; require = localRequire;
var test = require("tape-compat");
var it = test.it;
var assert = require("assert"),
    util = require("util"),
    Parser = require("htmlparser2").Parser,
    Handler = require("domhandler"),
//    loader = require("wilton/loader"),
    forEach = require("lodash/forEach");

var basePath = "domhandler/test/cases/";
// explicit list for in-zip case
var list = [
    "01-basic.json",
    "02-single_tag_1.json",
    "03-single_tag_2.json",
    "04-unescaped_in_script.json",
    "05-tags_in_comment.json",
    "06-comment_in_script.json",
    "07-unescaped_in_style.json",
    "08-extra_spaces_in_tag.json",
    "09-unquoted_attrib.json",
    "10-singular_attribute.json",
    "11-text_outside_tags.json",
    "12-text_only.json",
    "13-comment_in_text.json",
    "14-comment_in_text_in_script.json",
    "15-non-verbose.json",
    "16-normalize_whitespace.json",
    "17-xml_namespace.json",
    "18-enforce_empty_tags.json",
    "19-ignore_empty_tags.json",
    "20-template_script_tags.json",
    "21-conditional_comments.json",
    "22-lowercase_tags.json",
    "23-dom-lvl1.json",
    "24-with-start-indices.json",
    "25-with-end-indices.json"
];

forEach(list, function(path){
//        var testJson = loader.loadModuleResource("domhandler/test/cases/" + path );
//        var test = JSON.parse(testJson);
        require(["json!domhandler/test/cases/" + path], function(test) {
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

require = requireOrig;});
