StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Maximum number of parallel branches')

    
    var branchesNum = 0
    
    Class('TestClass', {
        
        trait       : JooseX.CPS,
        
        continued : {
            
            methods : {
                
                process : function () {
                    branchesNum++
                    
                    var CONT = this.getCONTINUE()
                    
                    setTimeout(function () {
                        
                        branchesNum--
                        
                        CONT()
                        
                    }, 100)
                },
                
                
                test : function () {
                    for (var i = 0; i < 50; i++)
                        this.AND(function () {
                            
                            this.process().now()
                        })
                        
                    this.ANDMAX(5)
                        
                    this.NOW()
                }
            }
            
        }
    })

    
    var obj = new TestClass()
    
    
    var interval = setInterval(function () {
        
        // default is 10 branches so test won't pass w/o `ANDMAX` setting in effect
        if (branchesNum > 5) t.fail('More than 5 running branches detected')
        
    }, 20)
    
    
    var async1 = t.beginAsync()
    
    obj.test().andThen(function () {
        
        t.pass('Test completed successfully')
        
        clearInterval(interval)
        
        t.endAsync(async1)
        t.done()
    })
})    