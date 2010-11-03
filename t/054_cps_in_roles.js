StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Should be possible to have roles with `JooseX.CPS` trait')
    
    
    Role('TestRole', {
        
        trait       : JooseX.CPS,
        
        continued : {
            
            methods : {
                
                async : function (num) {
                    this.CONTINUE(num)
                }
            }
        }
    })
    
    
    Class('TestClass', {
        
        trait       : JooseX.CPS,
        
        does        : TestRole,
        
        
        continued : {
            
            methods : {
                
                process : function () {
                    this.async(10).andThen(function (res) {
                        
                        t.ok(res == 10, 'Correct result from `async` method, recived from role')
                    
                        this.CONTINUE('process')
                    })
                }
            }
        }
    })

    //======================================================================================================================================================================================================================================================            
    t.diag('Simple role application')

    
    var obj = new TestClass()
    
    obj.process().andThen(function (res) {
        
        t.ok(res == 'process', 'Correct result from `process` method')
    })
    
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Using role as trait')
    
    var obj2 = new TestClass({
        
        trait   : TestRole
    })
    
    
    obj2.process().andThen(function (res) {
        
        t.ok(res == 'process', 'Correct result from `process` method')
    })

    
    //======================================================================================================================================================================================================================================================            
    t.diag('More complex compisition relationships')
    
    Role('TransitionalRole', {
        
        trait       : JooseX.CPS,
        
        does        : TestRole,
        
        continued : {
            
            methods : {
                
                transitional : function () {
                    this.CONTINUE('transitional')
                }
            }
        }
    })
    
    
    Class('Transitional', {
        
        does        : TransitionalRole
    })
    

    var obj3 = new Transitional()
    
    
    obj3.async(123).andThen(function (res) {
        
        t.ok(res == 123, 'Correct result from `async` method')
    })
    
    
    obj3.transitional().andThen(function (res) {
        
        t.ok(res == 'transitional', 'Correct result from `transitional` method')
    })
    
    
    t.done()
})    
