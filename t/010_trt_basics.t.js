StartTest(function(t) {
    
	t.plan(12)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Instantiation')
        
        var cont = new JooseX.CPS.Continuation.TryRetThen()
        
        t.ok(cont, "'JooseX.CPS.Continuation.TryRetThen' was instantiated")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('CPS calls, desugared')
        

        //======================================================================================================================================================================================================================================================            
        t.diag('Simplest call')

        var async1 = t.beginAsync()
        
        cont.TRY(function (p1, p2) {
            
            t.pass('TRY was reached')
            
            t.ok(this == Joose.top, 'Scope was defaulted to global scope')
            t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
            
            this.RETURN('value')
            
        }, null, [ 1, 10 ]).NEXT(function (res) {
            
            t.pass('NEXT was reached')
            
            t.ok(res == 'value', "Next received correct return value")
            
            this.RETURN()
            
            t.endAsync(async1)
            
        }).NOW()
        
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Simple successfull call')
        
        var async2  = t.beginAsync()
        var cont2   = new JooseX.CPS.Continuation.TryRetThen()
        var scope2  = {}

        
        cont2.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Simple call - TRY')
            
            t.ok(this == scope2, "Scope was correctly passed into 'TRY'")
            
            t.ok(this.CONT.parent == cont2, "Current continuation is nested into 'cont2'")
            
            var RETURN = this.RETURN
            
            setTimeout(function () {
                RETURN('returnTo')
            }, 10)

            
        }, scope2).THEN(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Simple call - THEN')
            
            t.ok(this == scope2, "Scope was correctly propagated to 'THEN'")
            
            t.ok(this.RESULT == 'returnTo', 'THEN was reached with the correct RESULT')
            
            t.endAsync(async2)
        })

        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Call without RETURN')
        
        var async3  = t.beginAsync()
        var cont3   = new JooseX.CPS.Continuation.TryRetThen()
        
        var thenReached = false
        
        cont3.TRY(function () {
            
        }, {}).THEN(function () {
            
            thenReached = true
        })

        setTimeout(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Call without RETURN')
        
            t.ok(!thenReached, 'THEN section was not reached without RETURN')
            
            t.endAsync(async3)
        }, 100)

        
        t.endAsync(async0)
    })
    
})    