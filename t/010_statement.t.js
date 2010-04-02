StartTest(function(t) {
    
	t.plan(33)
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.CPS.Statement, "JooseX.CPS.Statement is here")
    

    //======================================================================================================================================================================================================================================================
    t.diag('Instantiation')
    
    var async1 = t.beginAsync()
    
    var statement = new JooseX.CPS.Statement({
        
        func    : function (p1, p2) {
            t.pass("'func' was reached")
            
            t.ok(this == Joose.top, 'Scope was defaulted to global scope')
            t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
            
            this.CONT.CONTINUE('value')
        },
        args    : [ 1, 10 ],
        
        nextFunc    : function (res) {
            t.pass("'nextFunc' was reached")
            
            t.ok(res == 'value', "Next received correct return value")
            
            
            t.endAsync(async1)
            
        }
    
    })
    
    t.ok(statement, "'JooseX.CPS.Statement' was instantiated")
    

    //======================================================================================================================================================================================================================================================            
    t.diag('Simplest call')

    statement.entry()
        
        

    
    var async2  = t.beginAsync()
    var scope2  = {}
    var statement2 = new JooseX.CPS.Statement({
        
        func    : function (param) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Deferred CONTINUE')
            
            t.ok(param == 'statement2', "'func' received correct parameter")
            t.ok(this == scope2, "Scope was correctly passed into 'func'")
            
            var CONT = this.CONT
            
            t.ok(CONT.parent == statement2, "Statement was correctly embedded into scope")
            
            setTimeout(function () {
                CONT.CONTINUE('returnTo')
            }, 10)
        },
        scope   : scope2,
        
        nextFunc    : function (res) {
            t.ok(res == 'returnTo', "'nextFunc' was reached with the correct result")
            
            t.endAsync(async2)
        }
    
    })
    
    statement2.entry('statement2')

    

    var async3  = t.beginAsync()
    var scope3  = {}
    
    var catchCalled     = false
    var finallyCalled   = false
    var nextCalled      = false
    
    var statement3 = new JooseX.CPS.Statement({
        
        func    : function () {
            //======================================================================================================================================================================================================================================================            
            t.diag("'catchFunc/finallyFunc")
            
            var CONT = this.CONT
            
            CONT.THROW('error3', 'error3')
        },
        scope   : scope3,
        
        catchFunc   : function (e1, e2) {
            t.ok(!catchCalled, "'catchFunc' wasn't called yet")
            catchCalled = true
            
            t.ok(!finallyCalled, "'finallyFunc' wasn't called yet")
            t.ok(!nextCalled, "'nextFunc' wasn't called yet")
            
            t.ok(e1 == 'error3' && e2 == 'error3', "'catchFunc' received correct arguments")
            
            var CONT = this.CONT
            
            CONT.CONTINUE()
        },
        
        finallyFunc   : function () {
            t.ok(catchCalled, "'catchFunc' was called")
            
            t.ok(!finallyCalled, "'finallyFunc' wasn't called yet")
            finallyCalled = true
            
            t.ok(!arguments.length, "'finallyFunc' didn't receive any arguments")
            
            t.ok(!nextCalled, "'nextFunc' wasn't called yet")
            
            var CONT = this.CONT
            
            CONT.CONTINUE()
        },
        
        
        nextFunc    : function (res) {
            t.ok(catchCalled, "'catchFunc' was called")
            t.ok(finallyCalled, "'finallyFunc' was called")
            
            t.ok(!nextCalled, "'nextFunc' wasn't called yet")
            
            t.endAsync(async3)
        }
    
    })
    
    statement3.entry()
    
    
    
    var async4  = t.beginAsync()
    var scope4  = {}
    
    var catchCalled     = false
    var finallyCalled   = false
    var nextCalled      = false
    
    var statement4 = new JooseX.CPS.Statement({
        
        func    : function () {
            //======================================================================================================================================================================================================================================================            
            t.diag("'catchFunc/finallyFunc")
            
            var CONT = this.CONT
            
            setTimeout(function () {
                CONT.THROW('error4', 'error4')
            }, 10)
        },
        scope   : scope4,
        
        catchFunc   : function (e1, e2) {
            t.ok(!catchCalled, "'catchFunc' wasn't called yet")
            catchCalled = true
            
            t.ok(!finallyCalled, "'finallyFunc' wasn't called yet")
            t.ok(!nextCalled, "'nextFunc' wasn't called yet")
            
            t.ok(e1 == 'error4' && e2 == 'error4', "'catchFunc' received correct arguments")
            
            var CONT = this.CONT
            
            setTimeout(function () {
                CONT.CONTINUE()
            }, 10)
        },
        
        finallyFunc   : function () {
            t.ok(catchCalled, "'catchFunc' was called")
            
            t.ok(!finallyCalled, "'finallyFunc' wasn't called yet")
            finallyCalled = true
            
            t.ok(!arguments.length, "'finallyFunc' didn't receive any arguments")
            
            t.ok(!nextCalled, "'nextFunc' wasn't called yet")
            
            var CONT = this.CONT
            
            setTimeout(function () {
                CONT.CONTINUE()
            }, 10)
        },
        
        
        nextFunc    : function (res) {
            t.ok(catchCalled, "'catchFunc' was called")
            t.ok(finallyCalled, "'finallyFunc' was called")
            
            t.ok(!nextCalled, "'nextFunc' wasn't called yet")
            
            t.endAsync(async4)
        }
    
    })
    
    statement4.entry()
    
    

})    