StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Should be possible to have roles with `JooseX.CPS` trait')
    
    
    Class('TestClass', {
        
        trait       : JooseX.CPS,
        
        continued : {
            
            methods : {
                
                process : function () {
                    this.CONTINUE('process')
                }
            }
        }
    })

    //======================================================================================================================================================================================================================================================            
    t.diag('Simple role application')

    var async0      = t.beginAsync()
    
    
    var obj = new TestClass()
    
    var returned = false
    
    obj.process().delay(1000).andThen(function (res) {
        
        returned = true
        
        t.ok(res == 'process', 'Correct result from `process` method with delay')
        
        
        t.endAsync(async0)
        t.done()
    })
    
    setTimeout(function () {
        
        t.ok(!returned, "`delay` is still in progress")
        
    }, 500)
})    
