StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Return from `except` block should skip further `then/next` statements')
    
    t.plan(2)
    
    Class('TestClass', {
        
        trait       : JooseX.CPS,
        
        continued : {
            
            methods : {
                
                setup : function () {
                    this.THROW('exception')
                },
                
                
                process : function () {
                    
                    this.setup().except(function (e) {
                        
                        this.RETURN('return')
                        
                    }).ensure(function () {
                        
                        t.pass('Reached `ensure` after `RETURN` from `except`')
                        
                        this.CONTINUE()
                        
                    }).then(function () {
                        
                        t.fail('Reached `then` after `RETURN` from `except`')
                        
                        this.CONTINUE()
                        
                    }).now()
                }
            }
        }
    })

    //======================================================================================================================================================================================================================================================            
    t.diag('Simple role application')

    
    var obj = new TestClass()
    
    obj.process().andThen(function (res) {
        
        t.ok(res == 'return', 'Correct result from `process` method')
    })
})    
