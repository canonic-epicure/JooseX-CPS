StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Empty `TRY` call on classes with `JooseX.CPS` trait should detach the instance from implicit methods chaining')
    
    var async0  = t.beginAsync()
    
    
    Class('TestClass', {
        
        trait       : JooseX.CPS,
        
        methods     : {
            
            sync    : function (delay, num) {
                var me = this
                
                this.TRY().THEN(function () {
                    
                    setTimeout(function () {
                        
                        me.async(num).andThen(function (res) {
                            
                            t.ok(res == num, 'Correct result [' + res + '] from `async` method')
                        })                    
                    }, delay)
                    
                }).NOW()
            }
        },
        
        
        continued : {
            
            methods : {
                
                async : function (num) {
                    this.CONTINUE(num)
                },
                
                
                process : function () {
                    this.sync(1000, 1)
                    this.sync(100,  2)
                    
                    this.CONTINUE('process')
                }
            }
        }
    })

    
    var obj = new TestClass()
    
    obj.process().andThen(function (res) {
        
        t.ok(res == 'process', 'Correct result from `process` method')
    })

    
    setTimeout(function () {
        
        t.endAsync(async0)
        t.done()
        
    }, 1500)
})    
