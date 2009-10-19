StartTest(function(t) {
    
	t.plan(19)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        

        //======================================================================================================================================================================================================================================================
        //t.diag('THROW from nested TRY')

        var async1  = t.beginAsync()
        var cont1   = new JooseX.CPS.Continuation.TryRetThen()
        
        var finally1Reached = false
        var finally2Reached = false
        var catchReached    = false
        
        cont1.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('THROW from nested TRY')
            
            this.CONT.TRY(function () {
                
                throw 'error1'
                
            }).FINALLY(function () {
                
                finally1Reached = true
                
                t.pass("'FINALLY1' was reached #1")
                
                t.ok(!catchReached, "'CATCH' not yet reached")
                t.ok(!finally2Reached, "'FINALLY2' not yet reached")
                
                this.RETURN()
                
            }).NOW()
            
        }, {}).CATCH(function (e) {
            
            catchReached = true
            
            t.ok(e == 'error1', "Error thrown from nested 'TRY' was caught correctly")
            
            t.ok(!finally2Reached, "'FINALLY2' not yet reached")
            
            this.RETURN()
            
        }).FINALLY(function () {
            
            finally2Reached = true
                
            t.pass("'FINALLY' was reached #2")
            
            t.ok(catchReached, "'CATCH' was reached")
            t.ok(finally1Reached, "'FINALLY1' was reached")
            
            this.RETURN()
            
        }).THEN(function () {
            
            t.pass("'THEN' was reached")
            
            t.endAsync(async1)
        })

        
        
        //======================================================================================================================================================================================================================================================
        //t.diag('THROW from FINALLY')

        var async11  = t.beginAsync()
        var cont11   = new JooseX.CPS.Continuation.TryRetThen()
        
        var finally11Reached = false
        var finally22Reached = false
        var catch11Reached    = false
        
        cont11.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('THROW from nested TRY')
            
            this.CONT.TRY(function () {
                
                throw 'error11'
                
            }).FINALLY(function () {
                
                finally11Reached = true
                
                t.pass("'FINALLY11' was reached #1")
                
                t.ok(!catch11Reached, "'CATCH' not yet reached")
                t.ok(!finally22Reached, "'FINALLY22' not yet reached")
                
                throw 'error22'
                
            }).NOW()
            
        }, {}).CATCH(function (e) {
            
            catch11Reached = true
            
            t.ok(e == 'error22', "Caught exception is from FINALLY")
            
            t.ok(!finally22Reached, "'FINALLY2' not yet reached")
            
            this.RETURN()
            
        }).FINALLY(function () {
            
            finally22Reached = true
                
            t.pass("'FINALLY' was reached #2")
            
            t.ok(catch11Reached, "'CATCH' was reached")
            t.ok(finally11Reached, "'FINALLY11' was reached")
            
            this.RETURN()
            
        }).THEN(function () {
            
            t.pass("Outer 'THEN' was reached")
            
            t.endAsync(async11)
        })
        
        
//        //======================================================================================================================================================================================================================================================
//        //t.diag('Nested THROW/CATCH #2')
//
//        var async3  = t.beginAsync()
//        var cont3   = new JooseX.CPS.Continuation.TryRetThen()
//        
//        cont3.TRY(function () {
//            //======================================================================================================================================================================================================================================================            
//            t.diag('Nested THROW/CATCH #2')
//            
//            
//            this.CONT.TRY(function () {
//                
//                this.THROW('error3')
//                
//            }).CATCH(function (e) {
//            
//                t.ok(e == 'error3', "Innermost 'THROW' was caught correctly")
//                
//                this.RETURN('recover3')
//                
//            }).NOW()
//            
//            
//        }, {}).CATCH(function (e) {
//            
//            t.fail("'CATCH' for handled exception was reached")
//            
//            this.RETURN()
//            
//        }).THEN(function (res) {
//            
//            t.ok(res == 'recover3', "Control flow after handled exception is correct")
//            
//            t.endAsync(async3)
//        })

        
        t.endAsync(async0)
    })
    
})    