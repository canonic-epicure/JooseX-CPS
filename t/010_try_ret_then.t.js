StartTest(function(t) {
    
	t.plan(6)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Creation')
        
        var cont = new JooseX.CPS.Continuation.TryRetThen()
        
        t.ok(cont, "'JooseX.CPS.Continuation.TryRetThen' was instantiated")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('CPS calls, desugared')
        

        //======================================================================================================================================================================================================================================================            
        t.diag('Simplest call')

        var async1 = t.beginAsync()
        
        cont.TRY(function (cont) {
            
            t.pass('TRY was reached')
            t.endAsync(async1)
            
            cont.RETURN()
        }).NOW()
        
        
        
        //======================================================================================================================================================================================================================================================            
        t.diag('Simple successfull call')
        
        var async2 = t.beginAsync()
        var cont2 = new JooseX.CPS.Continuation.TryRetThen()

        cont2.TRY(function (cont) {
            
            setTimeout(function () {
                cont.RETURN('returnTo')
            }, 10)

            
        }).THEN(function (cont, result) {
            
            t.ok(result == 'returnTo', 'THEN was reached with the correct result')
            
            t.endAsync(async2)
        })

        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Call without RETURN')
        
        var async3 = t.beginAsync()
        var cont3 = new JooseX.CPS.Continuation.TryRetThen()
        
        var thenReached = false
        
        cont3.TRY(function (cont) {
            
        }).THEN(function (cont, result) {
            
            thenReached = true
        })

        setTimeout(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Call without RETURN')
        
            t.ok(!thenReached, 'THEN section was not reached without RETURN')
            
            t.endAsync(async3)
        }, 10)
        
        
        
        //======================================================================================================================================================================================================================================================            
        t.diag('Simple successfull call')
        
        var async4 = t.beginAsync()
        var cont4 = new JooseX.CPS.Continuation.TryRetThen()

        cont4.TRY(function (cont) {
            
            setTimeout(function () {
                cont.RETURN('returnTo')
            }, 10)

            
        }).THEN(function (cont, result) {
            
            t.ok(result == 'returnTo', 'THEN was reached with the correct result')
            
            t.endAsync(async4)
        })
        
        t.endAsync(async0)
    })
    
})    