StartTest(function(t) {
    
	t.plan(5)
    
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
            
            continued : {
                
                methods : {
                    
                    async1 : function (param1, param2) {
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
        
        var res1 = cps.async1(1, 10)
        
        t.ok(res1 instanceof JooseX.CPS.Continuation.TryRetThen, "Continued methods returned an instance of 'JooseX.CPS.Continuation.TryRetThen'")
        
        t.endAsync(async0)
    })
    
})    