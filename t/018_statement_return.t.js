StartTest(function(t) {
    
	t.plan(4)
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.CPS.Continuation, "JooseX.CPS.Continuation is here")
    
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Nesting with RETURN')

    
    TRY(function () {
        
        this.CONT.TRY(function () {
            
            t.pass("Nested 'TRY' reached")
            
            this.CONT.RETURN('return2')
            
        }).THEN(function () {
            
            t.fail("'THEN' reached after 'RETURN'")
            
            this.CONT.CONTINUE()
            
        }).NEXT(function (res) {
        
            t.fail("'NEXT' reached after 'RETURN'")
            
            this.CONT.CONTINUE()
            
        }).NOW()
        
    }).THEN(function (res) {
        
        t.pass("OUTER 'THEN' reached after 'RETURN' from nested 'TRY'")
        
        t.ok(res == 'return2', "'THEN' received correct result")
        
    }).NOW()
})    