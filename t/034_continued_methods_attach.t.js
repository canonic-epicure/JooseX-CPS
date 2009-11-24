StartTest(function(t) {
    
	t.plan(13)
    
    var async0 = t.beginAsync()
	
    use('JooseX.CPS', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS, "JooseX.CPS is here")
        t.ok(JooseX.CPS.Builder, "JooseX.CPS.Builder is here")
        t.ok(JooseX.CPS.Continuation, "JooseX.CPS.Continuation is here")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Class creation')
        
        
        Class('CPS.Enabled1', {
            
            trait : JooseX.CPS,
            
            continued : {
                
                methods : {
                    
                    process1 : function (param1, param2) {
                        this.CONTINUE(param1 + param2)
                    },
                    
                    
                    withError1 : function (param1, param2) {
                        throw param1 + param2
                    } 
                }
            }
        })
        t.ok(CPS.Enabled1, 'CPS.Enabled1 class was created')
        
        
        Class('CPS.Enabled2', {
            
            trait : JooseX.CPS,
            
            has : {
                one     : null
            },
            
            
            continued : {
                
                methods : {
                    
                    process2 : function (param1, param2) {
                        var scope = this.one
                        
                        this.one.process1(param1, param2).next(function (res) {
                            t.ok(this == scope, 'Scope is correct')
                            
                            this.CONTINUE(res)
                        })
                    },
                    
                    
                    withError2 : function (param1, param2) {
                        var scope = this.one
                        
                        this.one.withError1(param1, param2).CATCH(function (e) {
                            
                            t.ok(this == scope, 'Scope is in CATCH is correct')
                            
                            this.THROW(e)
                        }).NOW()
                    }
                }
            }
        })
        
        t.ok(CPS.Enabled2, 'CPS.Enabled2 class was created')

        
        //======================================================================================================================================================================================================================================================
        t.diag('Call to nested continued methods')
        
        var async1 = t.beginAsync()
        
        var obj = new CPS.Enabled2({
            one : new CPS.Enabled1()
        })
        
        obj.process2(1, 1).NEXT(function (res) {
            
            t.pass("'NEXT' was reached")
            
            t.ok(res == 2, ".. with the correct result")
            
            t.ok(this == obj, ".. and in the correct scope")
            
            t.endAsync(async1)
        })
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Call to nested continued methods - with exception')
        
        var async2 = t.beginAsync()
        
        obj.withError2(1, 10).THEN(function (res) {
            
            t.fail("'THEN' was reached after exception")
            
        }).CATCH(function (e) {
            
            t.pass("'CATCH' was reached")
            
            t.ok(e == 11, ".. with the correct exception")
            
            t.ok(this == obj, ".. and in the correct scope")
            
            t.endAsync(async2)
        }).NOW()
        
        
        t.endAsync(async0)
    })
    
})    