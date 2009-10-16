StartTest(function(t) {
    
	t.plan(9)
    
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
        
        cont7.TRY(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Chained THEN - TRY')
            
            t.ok(this.CONT.parent == cont7, "Current continuation is nested into 'cont7'")
            
            t.ok(this == scope7, "Scope was correctly passed into 'TRY'")
            
            this.RETURN('result7')
            
        }, scope7)
        

        var cont9 = cont7.THEN(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Chained THEN - THEN #1')
            
            t.ok(this.CONT.parent == cont9, "Current continuation is nested into 'cont9'")
            
            t.ok(this == scope7, "Scope was correctly propagated to 'THEN'")
            
            t.ok(this.RESULT == 'result7', 'THEN #1 was reached with the correct RESULT')
            
            this.RETURN('result7-2')
            
        })
        
        
        var cont11 = cont9.THEN(function () {
            //======================================================================================================================================================================================================================================================            
            t.diag('Chained THEN - THEN #2')
            
            t.ok(this.CONT.parent == cont11, "Current continuation is nested into 'cont11'")

            t.ok(this == scope7, "Scope was correctly propagated to 2nd 'THEN'")
            
            t.ok(this.RESULT == 'result7-2', 'THEN #2 was reached with the correct RESULT')
            
            t.endAsync(async7)
        })
        
        
        t.endAsync(async0)
    })
    
})    