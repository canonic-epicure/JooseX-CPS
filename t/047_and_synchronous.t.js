StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Maximum number of parallel branches')

    
    var branchesNum = 0
    
    Class('TestClass', {
        
        trait       : JooseX.CPS,
        
        continued : {
            
            methods : {
                
                process : function () {
                    this.CONTINUE()
                },
                
                
                test : function () {
                    for (var i = 0; i < 10; i++)
                        this.AND(function () {
                            
                            this.process().now()
                        })
                        
                    this.NOW()
                }
            }
            
        }
    })

    
    var obj = new TestClass()

    
    obj.test().andThen(function () {
        
        t.pass('Test completed successfully')
        
        t.done()
    })
})    