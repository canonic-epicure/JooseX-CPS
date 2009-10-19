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
        
        
        var cps = new Class.With.CPS.Enabled()
        
        this <- cps
        
        this.async1(p1, p2).THEN(
        
            this.async2(p3, p4)
            
        ).THEN(
        
            this.async3(p4, p5)
            
        ).THEN(function () {
            
            if (this.RESULT == '...') 
                this.async4().NOW()
            else
                this.RETURN()
        })
        

        
        
        this.async1(p1, p2).OR(
        
            this.async2(p3, p4)
            
        ).AND(
        
            this.async3(p4, p5)
            
        ).THEN(function () {
            
            if (this.RESULT == '...') 
                this.async4().NOW()
            else 
                if (this.RESULT) this.RETURN()
        })
        
        
        
        
        
        
        try {
            console.log('outer try')
            try {
                console.log('inner try')
                throw 'a'
            } finally {
                console.log('inner fin')
            }
        
        } catch (e) {
            console.log('catch')
        } finally {
            console.log('outer fin')
        }        
        
        
        
        
        try {
            console.log('outer try')
            try {
                console.log('inner try')
                throw 'a'
            } finally {
                console.log('inner fin')
                throw 'b'
            }
        
        } catch (e) {
            console.log('caught:' + e)
        } finally {
            console.log('outer fin')
        }        

        
        
        try {
            console.log('outer try')
            try {
                console.log('inner try')
                throw 'a'
            } catch (e) {
                console.log('inner catch')
                throw 'b'
            }
        
        } catch (e) {
            console.log('outer catch')
        } finally {
            console.log('outer fin')
        }        
        
        
    })
    
})    