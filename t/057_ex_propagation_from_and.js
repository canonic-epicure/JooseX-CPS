StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Exception should propagate even though the AND statements')
    
    
    Class('Test', {
    
        trait       : JooseX.CPS,
        
        continued  : {
        
            methods : {
            
                process : function () {
                    this.AND(function () {
                        this.CONTINUE()
                    })
                    
                    this.AND(function () {
                        this.CONTINUE()
                    })
                    
                    this.NOW()
                }
            }
        }
    })
    
    
    var handle = new Test();
    
    
    t.throws_ok(function () {
        
        handle.process().then(function () {
            
            debugger
        
            throw "error";
            
        }).now();
        
    }, "error", 'Exception propagated correctly')
    
    
    t.done()
})    
