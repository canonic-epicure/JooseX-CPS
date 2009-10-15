StartTest(function(t) {
    
	t.plan(24)
    
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
        
        cont.TRY(function (p1, p2) {
            
            t.pass('TRY was reached')
            
            t.ok(this.parent == cont, 'Scope was defaulted to nested continuation instance')
            t.ok(p1 == 1 && p2 == 10, 'Correct parameters were passed')
            
            this.RETURN()
            
            t.endAsync(async1)
            
        }, null, [ 1, 10 ]).NOW()
        
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Simple successfull call')
        
        var async2  = t.beginAsync()
        var cont2   = new JooseX.CPS.Continuation.TryRetThen()
        var scope2  = {}

        
        cont2.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Simple call - TRY')
            
            t.ok(this == scope2, "Scope was correctly passed into 'TRY'")
            
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
        
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag("'TRY' nesting")
        
        var async4      = t.beginAsync()
        var cont4       = new JooseX.CPS.Continuation.TryRetThen()
        var scope4      = {}
        var scope4Then  = {}

        cont4.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag("'TRY' nesting - TRY")
            
            t.ok(this == scope4, "Scope was correctly passed into 'TRY' #2")
            
            var CONT = this.CONT
            
            
            setTimeout(function () {
                
                CONT.TRY(function () {
                    
                    t.ok(this == scope4, "Scope was correctly passed into nested 'TRY'")
                    
                    this.RETURN('returnTo')
                }).NOW()
                
            }, 10)
            
        }, scope4).THEN(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag("'TRY' nesting - THEN")
            
            t.ok(this == scope4Then, "Scope was correctly passed into 'THEN'")
            
            t.ok(this.RESULT == 'returnTo', 'THEN was reached from the nested TRY with the correct result')
            
            t.endAsync(async4)
        }, scope4Then)

        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Try/Then nesting')
        
        var async5      = t.beginAsync()
        var cont5       = new JooseX.CPS.Continuation.TryRetThen()
        var scope5      = {}
        
        cont5.TRY(function (cont) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Try/Then nesting - TRY')
            
            t.ok(this == scope5, "Scope was correctly passed into 'TRY' #3")
            
            var CONT = this.CONT
            
            
            setTimeout(function () {
                
                CONT.TRY(function () {
                    
                    t.ok(this == scope5, "Scope was correctly passed into nested 'TRY' #2")
                    
                    this.RETURN('returnTo2')
                    
                }).THEN(function () {
                    
                    t.ok(this == scope5, "Scope was correctly passed into nested 'THEN'")
                    
                    this.RETURN(this.RESULT)
                })
                
            }, 10)
            
        }, scope5).THEN(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Try/Then nesting - THEN')
            
            t.ok(this == scope5, "Scope was correctly passed into outer 'THEN'")
            
            t.ok(this.RESULT == 'returnTo2', 'THEN was reached from the nested TRY/THEN with the correct result :)')
            
            t.endAsync(async5)
        })
        
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('More Try/Then nesting')
        
        var async6  = t.beginAsync()
        var cont6   = new JooseX.CPS.Continuation.TryRetThen()
        var scope6  = {}
        
        cont6.TRY(function () {
            
            var CONT = this.CONT
            
            setTimeout(function () {
                
                CONT.TRY(function () {
                    
                    this.RETURN('returnTo2')
                    
                }).THEN(function () {
                    //======================================================================================================================================================================================================================================================            
                    t.diag('More Try/Then nesting - TRY')
                    
                    t.ok(this.RESULT == 'returnTo2', 'THEN was reached from the nested TRY with the correct result')
                    
                    
                    this.CONT.TRY(function () {
                        
                        t.ok(this == scope6, "Scope was correctly passed into most nested 'TRY'")
                        
                        this.RETURN('result3')
                        
                    }).THEN(function () {
                        
                        t.ok(this == scope6, "Scope was correctly passed into most nested 'THEN'")
                        
                        t.ok(this.RESULT == 'result3', 'Another THEN was reached from the nested TRY with the correct result')
                        
                        this.RETURN('result4')
                    })
                })
                
            }, 10)
            
        }, scope6).THEN(function (cont, result) {
            //======================================================================================================================================================================================================================================================            
            t.diag('More Try/Then nesting - THEN')
            
            t.ok(this == scope6, "Scope was correctly passed into outer 'THEN'")
            
            t.ok(this.RESULT == 'result4', 'Outer THEN was reached from the nested TRY/THEN/THEN with the correct result')
            
            t.endAsync(async6)
        })
        
        
        
        t.endAsync(async0)
    })
    
})    