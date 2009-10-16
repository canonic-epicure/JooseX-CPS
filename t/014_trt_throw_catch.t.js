StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        

        //======================================================================================================================================================================================================================================================
        //t.diag('Call with THROW/CATCH - unhandled error')
        

        var async1  = t.beginAsync()
        var cont1   = new JooseX.CPS.Continuation.TryRetThen()
        var scope1  = {}

        
        cont1.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Call with THROW/CATCH - unhandled error')
            
            this.CONT.THROW('error')
            
            throw 'error'
            
            t.fail("Reached code after unhandled 'THROW'")
            
        }, scope1).THEN(function () {
            
            t.fail("Reached 'THEN' after unhandled 'THROW'")
        })

        
        
//        
//        var async2  = t.beginAsync()
//        var cont2   = new JooseX.CPS.Continuation.TryRetThen()
//        var scope2  = {}
//
//        
//        cont2.TRY(function () {
//            //======================================================================================================================================================================================================================================================            
//            t.diag('Call with THROW/CATCH - TRY')
//            
//            
//            this.THROW('error')
//            
//            t.pass
//            
//        }, scope2).CATCH(function(e) {
//            
//            this.RECOVER()
//            
//        }).THEN(function () {
//            //======================================================================================================================================================================================================================================================            
//            t.diag('Simple call - THEN')
//            
//            t.ok(this == scope2, "Scope was correctly propagated to 'THEN'")
//            
//            t.ok(this.RESULT == 'returnTo', 'THEN was reached with the correct RESULT')
//            
//            t.endAsync(async2)
//        })

        
        t.endAsync(async0)
    })
    
})    