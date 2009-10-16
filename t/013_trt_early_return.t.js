StartTest(function(t) {
    
	t.plan(11)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('More Try/Then nesting')
        
        var async6  = t.beginAsync()
        var async7  = t.beginAsync()
        var cont6   = new JooseX.CPS.Continuation.TryRetThen()
        var scope6  = {}
        
        cont6.id = 6
        var cont7, cont8, cont9, cont10
        
        cont6.TRY(function () {
            
            cont7 = this.CONT
            cont7.id = 7
            
            var CONT = this.CONT
            
            t.ok(CONT.parent == cont6, "Current continuation is nested into 'cont6'")
            
            setTimeout(function () {
                
                CONT.TRY(function () {
                    //======================================================================================================================================================================================================================================================
                    t.diag('More Try/Then nesting - Nested TRY')
                    
//                    debugger
                    
                    cont8 = this.CONT
                    cont8.id = 8
                    
                    
                    t.pass("Nested 'TRY' was reached anyway, regardless of early RETURN")
                    
                    t.ok(this == scope6, "Scope was correctly passed into nested 'TRY'")
                    
                    t.ok(this.CONT.parent == CONT, "Current continuation is nested into 'CONT'")
                    
//                    debugger
                    
                    this.RETURN('returnTo2')
                    
                }).THEN(function () {
                    //======================================================================================================================================================================================================================================================            
                    t.diag('More Try/Then nesting - TRY')

                    
                    cont9 = this.CONT
                    cont9.id = 9
                    
                    
                    
                    t.ok(this.RESULT == 'returnTo2', 'THEN was reached from the nested TRY with the correct result')
                    
                    
                    this.CONT.TRY(function () {
                        
                        t.ok(this == scope6, "Scope was correctly passed into most nested 'TRY'")
                        
                        this.RETURN('result3')
                        
                    }).THEN(function () {
                        
                        t.ok(this == scope6, "Scope was correctly passed into most nested 'THEN'")
                        
                        t.ok(this.RESULT == 'result3', 'Another THEN was reached from the nested TRY with the correct result')
                        
                        this.RETURN('result4')
                        
                        t.endAsync(async6)
                    })
                })
                
//                debugger
                
                CONT.RETURN('early')
                
            }, 10)
            
        }, scope6).THEN(function (cont, result) {
            //======================================================================================================================================================================================================================================================            
            t.diag('More Try/Then nesting - THEN')
            
            
//            debugger

            cont10 = this.CONT
            cont10.id = 10
            
            
            
            
            t.ok(this == scope6, "Scope was correctly passed into outer 'THEN'")
            
            t.ok(this.RESULT == 'early', 'Early returned was processed correctly')
            
            t.endAsync(async7)
        })
        
        t.endAsync(async0)
    })
    
})    