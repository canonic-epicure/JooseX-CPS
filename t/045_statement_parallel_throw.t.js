StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Simplest call')

    
    try {
    
        TRY(function () {
            
            var CONT = this.CONT
            
            
            CONT.AND(function () {
                throw 'error1'    
            })
            
            
            CONT.NOW()
            
        }).THEN(function () {
            
            t.pass('THEN was reached')
            
            throw 'error-then'
            
        }).NOW()
        
    } catch (e) {
        
        t.diag(e)
        
        t.ok(e == 'error-then', 'Correct exception caught')
    }
    
    t.done()
})    