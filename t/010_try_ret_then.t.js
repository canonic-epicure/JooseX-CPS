StartTest(function(t) {
    
	t.plan(10)
    
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
        //t.diag('Simple successfull call')
        
        var async2 = t.beginAsync()
        var cont2 = new JooseX.CPS.Continuation.TryRetThen()

        cont2.TRY(function (cont) {
            
            setTimeout(function () {
                cont.RETURN('returnTo')
            }, 10)

            
        }).THEN(function (cont, result) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Simple successfull call')
            
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
        }, 100)
        
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Try nesting')
        
        var async4 = t.beginAsync()
        var cont4 = new JooseX.CPS.Continuation.TryRetThen()

        cont4.TRY(function (cont) {
            
            setTimeout(function () {
                
                cont.TRY(function (cont) {
                    cont.RETURN('returnTo')
                }).NOW()
                
            }, 10)
            
        }).THEN(function (cont, result) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Try nesting')
            
            t.ok(result == 'returnTo', 'THEN was reached from the nested TRY with the correct result')
            
            t.endAsync(async4)
        })

        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Try/Then nesting')
        
        var async5 = t.beginAsync()
        var cont5 = new JooseX.CPS.Continuation.TryRetThen()
        
        cont5.TRY(function (cont) {
            
            setTimeout(function () {
                
                cont.TRY(function (cont) {
                    
                    cont.RETURN('returnTo2')
                    
                }).THEN(function (cont, result) {
                    
                    cont.RETURN(result)
                })
                
            }, 10)
            
        }).THEN(function (cont, result) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Try/Then nesting')
            
            t.ok(result == 'returnTo2', 'THEN was reached from the nested TRY/THEN with the correct result :)')
            
            t.endAsync(async5)
        })
        
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('More Try/Then nesting')
        
        var async6 = t.beginAsync()
        var cont6 = new JooseX.CPS.Continuation.TryRetThen()
        
        cont6.TRY(function (cont) {
            
            setTimeout(function () {
                
                cont.TRY(function (cont) {
                    
                    cont.RETURN('returnTo2')
                    
                }).THEN(function (cont, result) {
                    
                    t.ok(result == 'returnTo2', 'THEN was reached from the nested TRY with the correct result')
                    
                    cont.TRY(function (cont) {
                        cont.RETURN('result3')
                    }).THEN(function (cont, result) {
                        t.ok(result == 'result3', 'Another THEN was reached from the nested TRY with the correct result')
                        
                        cont.RETURN('result4')
                    })
                })
                
            }, 10)
            
        }).THEN(function (cont, result) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Try/Then nesting')
            
            t.ok(result == 'result4', 'Outer THEN was reached from the nested TRY/THEN/THEN with the correct result')
            
            t.endAsync(async6)
        })
        
        
        
        t.endAsync(async0)
    })
    
})    