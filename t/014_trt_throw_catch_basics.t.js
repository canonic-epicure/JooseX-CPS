StartTest(function(t) {
    
	t.plan(13)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        

        //======================================================================================================================================================================================================================================================
        //t.diag('Call with THROW/CATCH - simple error')

        var async1  = t.beginAsync()
        var cont1   = new JooseX.CPS.Continuation.TryRetThen()
        var scope1  = {}

        
        cont1.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Call with THROW/CATCH - simple error')
            
            this.THROW('error1')
            
        }, scope1).NEXT(function () {
            
            t.fail("'NEXT' was reached after exception")
            
        }).CATCH(function (e) {
            
            t.ok(this == scope1, "'CATCH' scope was copied from 'TRY'")
            
            t.ok(e == 'error1', "Error thrown via 'THROW' was caught")
            
            t.endAsync(async1)
            
            this.RETURN()
            
        }).FINALLY(function () {
            
            t.pass("'FINALLY' was reached")
            
            t.ok(this == scope1, "'FINALLY' scope was copied from 'TRY'")
            
            this.RETURN()
            
        }).NOW()



        //======================================================================================================================================================================================================================================================
        //t.diag('Call with THROW/CATCH - no error, plus FINALLY')

        var async15  = t.beginAsync()
        var cont15   = new JooseX.CPS.Continuation.TryRetThen()
        var scope15  = {}

        cont15.TRY(function () {
            
            this.RETURN()
            
        }, {}).CATCH(function (e) {
            
            t.fail("'CATCH' was reached without 'THROW'")
            
            this.RETURN()
            
        }).FINALLY(function () {
            
            t.pass("'FINALLY' was reached")
            
            t.ok(this == scope15, "'FINALLY' scope was copied from arguments")
            
            t.endAsync(async15)
            
            this.RETURN()
            
        }, scope15).NOW()

        
        
        //======================================================================================================================================================================================================================================================
        //t.diag('Call with THROW/CATCH - native exceptions, THROW from NEXT')

        var async2  = t.beginAsync()
        var cont2   = new JooseX.CPS.Continuation.TryRetThen()
        var scope2  = {}

        
        cont2.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Call with THROW/CATCH - native exceptions')
            
            t.pass("Initial 'TRY' was reached")
            
            this.RETURN()
            
        }).NEXT(function () {
            
            throw 'error2'
            
            t.fail("Reached code after 'THROW'")
            
        }, {}).CATCH(function (e) {
            
            t.ok(this == scope2, "'CATCH' scope was taken from arguments")
            
            t.ok(e == 'error2', "Error thrown via native 'throw' was caught correctly")
            
            t.endAsync(async2)
            
            this.RETURN()
            
        }, scope2).NOW()
        
        
        
        //======================================================================================================================================================================================================================================================
        //t.diag('THROW with THEN')

        var async3  = t.beginAsync()
        var cont3   = new JooseX.CPS.Continuation.TryRetThen()
        
        cont3.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('THROW with THEN')
            
            throw 'error3'
            
            t.fail("Reached code after 'THROW'")
            
        }, {}).CATCH(function (e) {
            
            t.ok(e == 'error3', "Error thrown via native 'throw' was caught correctly")
            
            this.RETURN()
            
        }).FINALLY(function () {
            
            t.pass("'FINALLY' was reached")
            
            this.RETURN()
            
        }).THEN(function () {
            
            t.pass("'THEN' was reached")
            
            t.endAsync(async3)
        })

        
        t.endAsync(async0)
    })
    
})    