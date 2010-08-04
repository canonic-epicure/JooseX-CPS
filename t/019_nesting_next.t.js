StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.CPS.Continuation, "JooseX.CPS.Continuation is here")
    
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Parallel flow nested into anoter continuation')

    var async1 = t.beginAsync()
    
    var thenReached     = false
    
    
    TRY(function () {
    
        this.CONT.TRY(function () {
            
            
            this.CONT.THEN(function () {
                t.pass('THEN reached')
                
                this.CONT.CONTINUE()
                
            }).NEXT(function () {
                
                t.pass('NEXT reached')
                
                this.CONT.CONTINUE()
                
            }).NOW()
            
        }).andTHEN(function () {
            
            thenReached = true
            
            this.CONT.CONTINUE()
        })
        
    }).andTHEN(function () {
        
        t.ok(thenReached, 'THEN a bit after parallel reached')
        
        t.pass('outer THEN reached')
        
        
        t.done()
        
        t.endAsync(async1)
    })
    
})    