StartTest(function(t) {
    
	t.plan(18)
    
    var async0 = t.beginAsync()
	
    use('JooseX.CPS', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS, "JooseX.CPS is here")
        t.ok(JooseX.CPS.Builder, "JooseX.CPS.Builder is here")
        t.ok(JooseX.CPS.Statement, "JooseX.CPS.Statement is here")

        //======================================================================================================================================================================================================================================================
        t.diag('Class creation')
        
        
        Class('Base', {
            
            methods : {
                
                checkEven : function (param1, param2) {
                    return param1 + param2
                }
            }
        })
        t.ok(Base, 'Base class was created')
        
        
        
        Class('CPS.Enabled', {
            
            isa : Base,
            
            trait : JooseX.CPS,
            
            continued : {
                
                override : {
                    checkEven : function (param1, param2) {
                        
                        if (this.SUPER(param1, param2) % 2 == 0) 
                            this.CONTINUE('even')
                        else
                            this.THROW('odd')
                    }
                }
            }
        
        })
        
        t.ok(CPS.Enabled, 'CPS.Enabled class was created')

        
        Class('CPS.Enabled.Further', {
            
            isa : CPS.Enabled,
            
            continued : {
                
                override : {
                    checkEven : function (param1, param2) {
                        
                        var me = this
                        
                        this.SUPER(param1 * 2, param2 * 3).THEN(function () {
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Scope check')
                            
                            t.ok(this == me, 'THEN was reached in the correct scope')
                            
                            this.CONTINUE('p1 * 2 + p2 * 3 is even')
                                
                        }).CATCH(function () {
                            
                            this.CONTINUE('p1 * 2 + p2 * 3 is odd')
                        }).NOW()
                    }
                }
            }
        
        })
        
        t.ok(CPS.Enabled.Further, 'CPS.Enabled.Further class was created. Trait for metaclass was inherited')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Call to continued override modifier - with error')
        
        var cps = new CPS.Enabled()
        
        var async1 = t.beginAsync()
        
        var res1 = cps.checkEven(1, 10)
        
        t.ok(res1 instanceof JooseX.CPS.Statement, "Continued methods returned an instance of 'JooseX.CPS.Statement'")
        
        res1.THEN(function () {
            
            t.fail("'THEN' was reached in presense of error")
            
        }).CATCH(function (e) {
            t.ok(e == 'odd', 'Odd sum was detected')
            
            this.CONTINUE('recover')
            
        }).FINALLY(function () {
            
            t.pass("'FINALLY' was reached anyway #1")
            
            this.CONTINUE()
            
        }).NEXT(function (res) {
            t.pass("'NEXT' was reached even in presense of error")
            
            t.ok(res == 'recover', 'NEXT received recovery value from CATCH')
            
            t.endAsync(async1)
        }).NOW()
        

        //======================================================================================================================================================================================================================================================
        t.diag('Call to deeply overriden method')
        
        var async2 = t.beginAsync()
        
        var further = new CPS.Enabled.Further()
        
        further.checkEven(1, 1).THEN(function (res) {
            
            t.pass("'THEN' was correctly reached")
            
            t.ok(res == 'p1 * 2 + p2 * 3 is odd', 'Odd sum was correctly detected')
            
            this.CONTINUE(res)
            
        }).CATCH(function (e) {
            
            t.fail("'CATCH' was reached in absense of error")
            
        }).FINALLY(function () {
            
            t.pass("'FINALLY' was reached anyway #2")
            
            this.CONTINUE()
            
        }).NEXT(function (res) {
            
            t.ok(res == 'p1 * 2 + p2 * 3 is odd', 'Odd sum was passed into NEXT, return value from FINALLY was ignored')
            
            t.endAsync(async2)
        }).NOW()
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Call to deeply overriden method #2')
        
        var async3 = t.beginAsync()
        
        further.checkEven(2, 2).THEN(function (res) {
            
            t.pass("'THEN' was correctly reached")
            
            t.ok(res == 'p1 * 2 + p2 * 3 is even', 'Even sum was correctly detected')
            
            t.endAsync(async3)
        }).NOW()
        
        
        t.endAsync(async0)
    })
    
})    