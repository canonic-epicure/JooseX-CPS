StartTest(function(t) {
    
    t.plan(2)
    
    //======================================================================================================================================================================================================================================================            
    t.diag('NOW on empty continuation (should be equal to CONTINUE)')
    
    
    TRY(function () {
        
        this.CONT.NOW()
        
    }).THEN(function () {
        
        t.pass('THEN was reached')
        
        this.CONT.CONTINUE()
        
    }).FINALLY(function () {
        
        t.pass('FINALLY was reached')
        
        this.CONT.CONTINUE()
        
    }).NOW()
})    
