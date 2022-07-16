const Parser = require('tree-sitter');
const JavaScript = require('tree-sitter-javascript');
const log = require('log-beautify');
const filesystem = require("./io");


const parser = new Parser();
parser.setLanguage(JavaScript);

const sourceCode = filesystem.getFile('./debug.js')
const tree = parser.parse(sourceCode);

// log.info(tree.rootNode.children);


let results = []
log.warning("=> RootNode has errors: " + tree.rootNode.hasError())
findByText(tree, "enabled", ["statement_block"])
log.info(results)

function findByTextInChild(_child, _text, _avoid){
    _child.children.forEach((e) => {
        for (let i = 0; i < e.childCount; i++) {        
            if ((_avoid.indexOf(e.child(i).type)) && (e.child(i).text.indexOf(_text) > -1)){
                // log.info(" child: " + e.toString())
                results.push({ text: e.child(i).text, type: e.child(i).type, isError: e.child(i).isError });
            }
            findByTextInChild(e.child(i), _text, _avoid)
        }
    })
}

function findByText(_tree, _text, _avoid = ["statement_block"]) {
    if(_text.length < 0) { throw new Error("no text supplied")}
    log.warning("=> finding: " + _text)
    log.warning("=> avoid: " + _avoid)
    

    _tree.rootNode.children.forEach((e) => {
        for (let i = 0; i < e.childCount; i++) {
            findByTextInChild(e.child(i), _text, _avoid)
        }
    })
}