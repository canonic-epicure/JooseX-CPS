StartTest(function(t) {
    
	t.plan(8)
    
    var async0 = t.beginAsync()
	
    use('JooseX.CPS', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS, "JooseX.CPS is here")
        t.ok(JooseX.CPS.Builder, "JooseX.CPS.Builder is here")
        t.ok(JooseX.CPS.Continuation, "JooseX.CPS.Continuation is here")

        //======================================================================================================================================================================================================================================================
        t.diag('Class creation')
        
        
        Class('Base', {
            
            methods : {
                
                sum : function (param1, param2) {
//                    debugger
                    
                    return param1 + param2
                }
            }
        })
        t.ok(Base, 'Base class was created')
        
        
        Class('CPS.Enabled', {
            
            isa : Base,
            
            trait : JooseX.CPS,
            
            has : {
                beforeCalled : false
            },
            
            continued : {
                
//                before : {
//                    checkEven : function (param1, param2) {
//                        
//                        this.beforeCalled = true
//                        
//                        var CONT = this.CONT
//                        
//                        setTimeout(function () {
//                            CONT.CONTINUE()
//                        }, 0)
//                    }
//                },
                
                
                override : {
                    sum : function (param1, param2) {
                        var CONT = this.CONT
                        
//                        debugger
                        
                        if (!this.beforeCalled) 
                            CONT.THROW("before wasn't called")
                        else
                            CONT.CONTINUE(this.SUPER(param1, param2))
                            
//                            this.SUPER(param1, param2).then(function (res) {
//                                this.CONT.CONTINUE(res)
//                            })
                            
                    }
                }
            }
        
        })
        
        t.ok(CPS.Enabled, 'CPS.Enabled class was created')

        
        Class('CPS.Enabled.Further', {
            
            isa : CPS.Enabled,
            
            continued : {
                
                before : {
                    sum : function (param1, param2) {
                        
//                        debugger
                        
                        this.beforeCalled = true
                        
                        var CONT = this.CONT
                        
                        setTimeout(function () {
                            CONT.CONTINUE()
                        }, 0)
                    }
                }
            }
        
        })
        
        t.ok(CPS.Enabled.Further, 'CPS.Enabled.Further class was created. Trait for metaclass was inherited')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Call to deeply overriden method')
        
        var async2 = t.beginAsync()
        
        var further = new CPS.Enabled.Further()
        
        further.sum(1, 10).THEN(function (res) {
            
            t.pass("'THEN' was correctly reached")
            
            t.ok(res == 11, 'Result is correct')
            
            t.endAsync(async2)
            
        }).NOW()
        
//        //======================================================================================================================================================================================================================================================
//        t.diag('Basic method call - without error')
        
        
        t.endAsync(async0)
    })
    
})    