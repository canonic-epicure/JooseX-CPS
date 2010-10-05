StartTest(function(t) {
    
    t.plan(2)
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Simplest call')
    
    try {
    
        TRY(function () {
            
            var CONT            = this.CONT
            var CONTINUE        = CONT.getCONTINUE()
            
            
//            CONT.THEN(function () {
//                
//                this.CONT.CONTINUE()
//                
//            }).THEN(function () {
                
                CONTINUE()
//            })
            
            CONT.NOW()
            
        }).THEN(function () {
            
            throw "exception"
            
        }).FINALLY(function () {
            
            t.pass('FINALLY was reached')
            
            this.CONT.CONTINUE()
            
        }).NOW()
        
    } catch (e) {
        
        t.diag(e)
        
        t.ok(e == 'exception', 'Correct exception caught')
    }
})    
