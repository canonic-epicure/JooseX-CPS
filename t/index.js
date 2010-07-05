var Harness

if (typeof process != 'undefined' && process.pid) {
    require('Task/Test/Run/NodeJSBundle')
    
    Harness = Test.Run.Harness.NodeJS
} else 
    Harness = Test.Run.Harness.Browser.ExtJS
        
    
var INC = [ '../lib', '/jsan' ]


Harness.my.configure({
	title : 'JooseX.CPS Test Suite',
	
	preload : Joose.is_NodeJS ? [
        'Task.JooseX.CPS.NodeJSTest',
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + JSON.stringify(INC)
        }
        
    ] : [
        'Task.JooseX.CPS.WebTest',
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + Ext.encode(Harness.my.absolutizeINC(INC))
        }
    ]
})


Harness.my.start(
	'010_statement_basics.t.js',
    '011_statement_nesting.t.js',
    '012_statement_chaining.t.js',
    '013_statement_independed.t.js',
    '014_statement_throw_catch_basics.t.js',
    '015_statement_throw_catch_nesting.t.js',
    '016_statement_throw_catch_finally.t.js',
    '017_statement_then_after_next.t.js',
    '018_statement_return.t.js',
    '020_statement_as_callback.t.js',
    '021_statement_as_errback.t.js',
    '030_continued_methods_put.t.js',
    '031_continued_methods_override.t.js',
    '032_continued_methods_before.t.js',
    '033_continued_methods_after.t.js',
    '034_continued_methods_attach.t.js',
    '035_continued_methods_sequencing.t.js',
    '036_continued_methods_fallback.t.js',
    '040_statement_parallel_basics.t.js',
    '041_statement_parallel_throw.t.js'
)
