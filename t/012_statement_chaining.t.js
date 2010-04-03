StartTest(function(t) {
    
	t.plan(9)
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.CPS.Statement, "JooseX.CPS.Statement is here")
    
    
    //======================================================================================================================================================================================================================================================            
    //t.diag('Chained NEXT')
    
    var async7  = t.beginAsync()
    var cont7   = new JooseX.CPS.Statement()
    var scope7  = {}
    
    cont7.TRY(function () {
        //======================================================================================================================================================================================================================================================            
        t.diag('Chained THEN - TRY')
        
        t.ok(this.CONT.parent == cont7, "Current continuation is nested into 'cont7'")
        
        t.ok(this == scope7, "Scope was correctly passed into 'TRY'")
        
        this.CONT.CONTINUE('result7')
        
    }, scope7)
    

    var cont9 = cont7.THEN(function (result) {
        //======================================================================================================================================================================================================================================================            
        t.diag('Chained THEN - THEN #1')
        
        t.ok(this.CONT.parent == cont9, "Current continuation is nested into 'cont9'")
        
        t.ok(this == scope7, "Scope was correctly propagated to 'THEN'")
        
        t.ok(result == 'result7', 'NEXT #1 was reached with the correct RESULT')
        
        this.CONT.CONTINUE('result7-2')
        
    })
    
    
    var cont11 = cont9.THEN(function (result) {
        //======================================================================================================================================================================================================================================================            
        t.diag('Chained THEN - THEN #2')
        
        t.ok(this.CONT.parent == cont11, "Current continuation is nested into 'cont11'")

        t.ok(this == scope7, "Scope was correctly propagated to 2nd 'THEN'")
        
        t.ok(result == 'result7-2', 'NEXT #2 was reached with the correct RESULT')
        
        t.endAsync(async7)
    })
    
    cont11.NOW()
    
})    