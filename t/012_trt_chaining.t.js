StartTest(function(t) {
    
	t.plan(8)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Chained THEN')
        
        var async7  = t.beginAsync()
        var cont7   = new JooseX.CPS.Continuation.TryRetThen()
        var scope7  = {}
        
        cont7.id = 7

        cont7.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Chained THEN - TRY')
            
            var cont8 = this.CONT
            cont8.id = 8
            
            t.ok(this.CONT.parent == cont7, "Current continuation is nested into 'cont7'")
            
            t.ok(this == scope7, "Scope was correctly passed into 'TRY'")
            
//            debugger
            
            this.RETURN('result7')
            
        }, scope7)
        
        
//        debugger
        
        var cont9 = cont7.THEN(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Chained THEN - THEN #1')
            
            var cont10 = this.CONT
            cont10.id = 10
            
            t.ok(this.CONT.parent == cont9, "Current continuation is nested into 'cont9'")
            
            t.ok(this == scope7, "Scope was correctly propagated to 'THEN'")
            
            t.ok(this.RESULT == 'result7', 'THEN #1 was reached with the correct RESULT')
            
//            debugger
            
            this.RETURN('result7-2')
            
        })
        
        cont9.id = 9
        
//        debugger
        
        var cont11 = cont9.THEN(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Chained THEN - THEN #2')

            var cont12 = this.CONT
            cont12.id = 12
            
            t.ok(this == scope7, "Scope was correctly propagated to 2nd 'THEN'")
            
            t.ok(this.RESULT == 'result7-2', 'THEN #2 was reached with the correct RESULT')
            
//            debugger
            
            t.endAsync(async7)
        })
        
        cont11.id = 11
        
        
        
        t.endAsync(async0)
    })
    
})    