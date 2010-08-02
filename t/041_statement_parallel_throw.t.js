StartTest(function(t) {
    
    t.plan(28)
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.CPS.Continuation, "JooseX.CPS.Continuation is here")
    
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Simplest call')

    var async1 = t.beginAsync()
    
    var branch1Reached  = false
    var branch2Reached  = false
    var branch3Reached  = false
    var thenReached     = false
    
    TRY(function (p1, p2) {
        
        var CONT = this.CONT
        
        setTimeout(function () {
            t.pass('1st branch was reached')
            
            t.ok(!branch1Reached, "Branch 1 wasn't reached yet")
            t.ok(branch2Reached, "Branch 2 was reached")
            t.ok(branch3Reached, "Branch 3 was reached")
            t.ok(!thenReached, "THEN wasn't reached yet")
            
            branch1Reached = true
            
            t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
            
            CONT.THROW('error1')
        }, 1000)
        
    }).AND(function (p1, p2) {
        
        var CONT = this.CONT
        
        setTimeout(function () {
            t.pass('2nd branch was reached')
            
            t.ok(!branch1Reached, "Branch 1 wasn't reached yet")
            t.ok(!branch2Reached, "Branch 2 wasn't reached yet")
            t.ok(branch3Reached,  "Branch 3 was reached")
            t.ok(!thenReached, "THEN wasn't reached yet")
            
            branch2Reached = true
            
            t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
            
            CONT.THROW('error2')
        }, 500)
        
    }).AND(function (p1, p2) {
        
        var CONT = this.CONT
        
        setTimeout(function () {
            t.pass('3rd branch was reached')
            
            t.ok(!branch1Reached, "Branch 1 wasn't reached yet")
            t.ok(!branch2Reached, "Branch 2 wasn't reached yet")
            t.ok(!branch3Reached, "Branch 3 wasn't reached yet")
            t.ok(!thenReached, "THEN wasn't reached yet")
            
            branch3Reached = true
            
            t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
            
            CONT.CONTINUE('value3')
        }, 0)
        
    }).CATCH(function (error) {
        
        t.fail("Reached 'CATCH' from parallel statement")
        
        this.CONTINUE()
        
    }).THEN(function () {
        
        t.pass('THEN was reached')
        
        t.ok(branch1Reached, "Branch 1 was reached")
        t.ok(branch2Reached, "Branch 2 was reached")
        t.ok(branch3Reached, "Branch 3 was reached")
        t.ok(!thenReached, "THEN wasn't reached yet")
        
        
        t.ok(arguments.length == 3, 'Seems we have correct results')
        
        t.ok(arguments[0][0] == 'error1', 'Indeed 1')
        t.ok(arguments[1][0] == 'error2', 'Indeed 2')
        t.ok(arguments[2][0] == 'value3', 'Indeed 3')
        
        
        t.endAsync(async1)
    }).NOW(1, 10)
    
})    