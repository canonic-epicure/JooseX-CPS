StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Empty `TRY` call on classes with `JooseX.CPS` trait should detach the instance from implicit methods chaining')
    
    var async0  = t.beginAsync()
    
    var result   = []
    
    
    Class('TestClass', {
        
        trait       : JooseX.CPS,
        
        methods     : {
            
            sync    : function (delay, num) {
                
                TRY(this).async(delay, num).now()               
            }
        },
        
        
        continued : {
            
            methods : {
                
                async : function (delay, num) {
                    var CONT    = this.CONT
                    
                    setTimeout(function () {
                        
                        result.push(num)
                        
                        CONT.CONTINUE(num)
                        
                    }, delay)
                },
                
                
                process : function () {
                    this.sync(500, '3')
                    this.sync(100, '2')
                    
                    this.async(10, '1')
                    
                    this.NOW()
                }
            }
        }
    })

    
    var obj = new TestClass()
    
    obj.process().andThen(function () {
        t.is_deeply(result, [ '1' ], 'Correct order of events #1')
    })

    
    setTimeout(function () {
        
        t.is_deeply(result, [ '1', '2', '3' ], 'Correct order of events #2')
        
        t.endAsync(async0)
        t.done()
        
    }, 1000)
})    
