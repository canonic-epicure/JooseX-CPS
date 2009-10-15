StartTest(function(t) {
    
	t.plan(1)
    
    var async1 = t.beginAsync()
	
    use('JooseX.CPS', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS, "JooseX.CPS is here")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Creation')
        
        Class('CPSEnabled', {
            
            trait : JooseX.CPS,
            
            
            continued : {
                
                cpsMeta : JooseX.CPS.Continuation,
                
                methods : {
                    
                    async1 : function (CPS, param1, param2) {
                    },
                    
                    
                    async2 : function () {
                    },
                    
                    
                    async3 : function () {
                    }
                },
                
                
                after : {
                    async1 : function (CPS, param1, param2) {
                        CPS.RETURN()
                    }
                }
            }
        
        })
        
        t.ok(CPSEnabled, 'CPSEnabled class was created')
        
        
        var cps = new CPSEnabled()
        
        t.ok(cps, 'CPSEnabled class was instantiated')
        
        
        cps.async1(p1, p2).THEN(
            cps.async2(p3, p4)
        ).THEN(
            cps.async3(p4, p5)
        )

        
        //===================================================        
        g00.TRY(function (g10, arg1, arg2) {
            
            p1 = 1
            p2 = p1 * 10
            
            this.continuedMethod1(g10, p1, p2).THEN(function (g10next, result1) {
                
                
                this.anotherContinuedMethod(g10next, par1, par2).THEN(function (g10nextnext, result2) {
                    
                    g10nextnext.RETURN(result+1)
                })
                
            })
            
            this.continuedMethod2(g10, p1, p2).THEN(function (scL1Next, result1) {
                
                
                this.anotherContinuedMethod(scL1, par1, par2).THEN(function (scL1, result2) {
                    
                    scL1.RETURN(result+1)
                })
                
            })
            
            
        }).THEN(function (globalNext1, result) {
        })
        
        
        
        g00.TRY(function (g1){
            
            g1.RETURN()
            
        }).[TRY()].[THEN()]
        

        
        
        g00.TRY(function (g10){
            
            g10.RETURN()
            
        }).TRY(function (g11){
            
            g11.RETURN()
            
        }).THEN(function (g01) {
            
        })
        
        
    })
    
})    