StartTest(function(t) {
    
	t.plan(10)
    
    var async0 = t.beginAsync()
	
    use('JooseX.CPS', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS, "JooseX.CPS is here")
        t.ok(JooseX.CPS.Builder, "JooseX.CPS.Builder is here")
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")

        //======================================================================================================================================================================================================================================================
        t.diag('Class creation')
        
        Class('CPS.Enabled', {
            
            trait : JooseX.CPS,
            
            methods : {
                
                xhr : function (params) {
            
                    setTimeout(function () {
                        if (params.error)
                            params.errback.call(params.scope || Joose.top, params.value1 || 'value1', params.value2 || 'value2', params)
                        else
                            params.callback.call(params.scope || Joose.top, params.value1 || 'value1', params.value2 || 'value2', params)
                    }, 1)
                }
            },
            
            
            continued : {
                
                methods : {
                    
                    checkEven : function (param1, param2) {
                        
                        var CONT = this.CONT
                        
                        setTimeout(function () {
                            if ((param1 + param2) % 2 == 0) 
                                CONT.RETURN('even')
                            else
                                CONT.THROW('odd')
                        })
                    },
                    
                    
                    async2 : function () {
                    },
                    
                    
                    async3 : function () {
                    }
                }
                
//                ,
//                after : {
//                    async1 : function (param1, param2) {
//                        this.RETURN()
//                    }
//                }
            }
        
        })
        
        t.ok(CPS.Enabled, 'CPS.Enabled class was created')

        
        //======================================================================================================================================================================================================================================================
        t.diag('Class instantiation')
        
        var cps = new CPS.Enabled()
        
        t.ok(cps, "'CPS.Enabled' class was instantiated")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Basic method call - with error')
        
        var async1 = t.beginAsync()
        
        var res1 = cps.checkEven(1, 10)
        
        t.ok(res1 instanceof JooseX.CPS.Continuation.TryRetThen, "Continued methods returned an instance of 'JooseX.CPS.Continuation.TryRetThen'")
        
        res1.CATCH(function (e) {
            t.ok(e == 'odd', 'Odd sum was detected')
            
            this.RETURN()
            
        }).FINALLY(function () {
            t.pass("'FINALLY' was reached even in presense of error")
            
            t.endAsync(async1)
            
        }).THEN(function () {
            t.fail("'THEN' was reached in presense of error")
        })
        

        //======================================================================================================================================================================================================================================================
        t.diag('Basic method call - without error')
        
        var async2 = t.beginAsync()
        
        cps.checkEven(1, 11).CATCH(function (e) {
            
            t.fail("'CATCH' was reached in absense of error")
        }).FINALLY(function () {
            
            t.pass("'FINALLY' was reached even in absense of error")
            
            this.RETURN()
            
        }).THEN(function (res) {
            t.ok(res == 'even', 'Even sum was detected')
            
            t.endAsync(async2)
        })
        
        t.endAsync(async0)
    })
    
})    