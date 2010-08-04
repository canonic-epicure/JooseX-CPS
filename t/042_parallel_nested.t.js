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
            
            var CONT = this.CONT
            
            CONT.AND(function () {
                
                t.pass('Branch 1 reached')
                
                this.CONT.CONTINUE()
            })
            
            
            CONT.AND(function () {
                
                t.pass('Branch 2 reached')
                
                this.CONT.CONTINUE()
            })
    
            CONT.AND(function () {
                
                t.pass('Branch 3 reached')
                
                this.CONT.CONTINUE()
            })
            
            
            CONT.andTHEN(function () {
                t.pass('THEN immediately after parallel reached')
                
                this.CONT.CONTINUE()
            })
            
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