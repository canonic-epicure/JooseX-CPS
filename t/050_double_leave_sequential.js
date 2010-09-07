StartTest(function(t) {
    
    t.plan(1)
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Simplest call')
    
    
    TRY(function () {
        
        var CONT            = this.CONT
        var CONTINUE        = CONT.getCONTINUE()
        
        
        CONT.THEN(function () {
            
            CONTINUE()
        })
        
        CONT.NOW()
        
    }).THEN(function () {
        
        t.pass('THEN was reached')
        
    }).NOW()
})    
