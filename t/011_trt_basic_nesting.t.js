StartTest(function(t) {
    
	t.plan(16)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        
        
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