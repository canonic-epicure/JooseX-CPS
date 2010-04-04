StartTest(function(t) {
    
    t.plan(12)
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.CPS.Statement, "JooseX.CPS.Statement is here")
    
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Simplest call')

    var async1 = t.beginAsync()
    
    TRY(function (p1, p2) {
        
        t.pass('1st branch was reached')
        
        t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
        
        this.CONT.CONTINUE('value1')
        
    }).AND(function (p1, p2) {
        
        t.pass('2nd branch was reached')
        
        t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
        
        this.CONT.CONTINUE('value2')
        
    }).AND(function (p1, p2) {
        
        t.pass('3rd branch was reached')
        
        t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
        
        this.CONT.CONTINUE('value3')
        
    }).THEN(function (results) {
        
        t.pass('THEN was reached')
        
        t.ok(results instanceof Array && results.length == 3, 'Seems we have correct results')
        
        t.ok(results[0][0] == 'value1', 'Indeed 1')
        t.ok(results[1][0] == 'value2', 'Indeed 2')
        t.ok(results[2][0] == 'value3', 'Indeed 3')
        
        
        t.endAsync(async1)
    }).NOW(1, 10)
    
    
    
//    //======================================================================================================================================================================================================================================================            
//    //t.diag('Simple successfull call')
//    
//    var async2  = t.beginAsync()
//    var cont2   = new JooseX.CPS.Statement()
//    var scope2  = {}
//
//    
//    cont2.TRY(function () {
//        //======================================================================================================================================================================================================================================================            
//        t.diag('Simple call - TRY')
//        
//        t.ok(this == scope2, "Scope was correctly passed into 'TRY'")
//        
//        t.ok(this.CONT.parent == cont2, "Current continuation is nested into 'cont2'")
//        
//        var CONTINUE = this.CONT.getCONTINUE()
//        
//        setTimeout(function () {
//            CONTINUE('returnTo')
//        }, 10)
//
//        
//    }, scope2).THEN(function (result) {
//        //======================================================================================================================================================================================================================================================            
//        t.diag('Simple call - NEXT')
//        
//        t.ok(this == scope2, "Scope was correctly propagated to 'NEXT'")
//        
//        t.ok(result == 'returnTo', 'NEXT was reached with the correct RESULT')
//        
//        t.endAsync(async2)
//    }).NOW()
//
//    
//    
//    //======================================================================================================================================================================================================================================================            
//    //t.diag('Call without CONTINUE')
//    
//    var async3  = t.beginAsync()
//    var cont3   = new JooseX.CPS.Statement()
//    
//    var thenReached = false
//    
//    cont3.TRY(function () {
//        
//    }, {}).THEN(function () {
//        
//        thenReached = true
//    })
//
//    setTimeout(function () {
//        //======================================================================================================================================================================================================================================================            
//        t.diag('Call without CONTINUE')
//    
//        t.ok(!thenReached, 'NEXT section was not reached without CONTINUE')
//        
//        t.endAsync(async3)
//    }, 100)
    
})    