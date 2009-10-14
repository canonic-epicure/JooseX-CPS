StartTest(function(t) {
    
	t.plan(11)
    
    var async1 = t.beginAsync()
    var async2 = t.beginAsync()
	
    use('JooseX.CPS.Continuation', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation, "JooseX.CPS.Continuation is here")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Creation')
        
        var cont = new JooseX.CPS.Continuation()
        
        t.ok(cont, "'JooseX.CPS.Continuation' was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('CPS calls, desugared')
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Simple successfull call')

        var scope = {
            name : 'value'
        }
        
        cont.setScope(scope)
        
        cont.THEN(function (value) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Simple successfull call')
            
            t.ok(this == scope, "'returnTo' was executed in the correct scope")
            
            t.ok(value == 'returnTo', 'ReturnTo was reached')
            
            t.endAsync(async1)
        })
        
        cont.TRY(function () {
            
            t.ok(this == scope, "'task' was executed in the correct scope")
            
            setTimeout(function () {
                cont.RETURN('returnTo')
            }, 10)
            
        }).CATCH()
        
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Simple failing call')

        var scope2 = {
            name : 'value'
        }
        
        var cont2 = new JooseX.CPS.Continuation()
        
        cont2.setScope(scope2)
        
        cont2.THEN(function (value) {
        })
        
        cont2.TRY(function () {
            
            t.ok(this == scope2, "'task' was executed in the correct scope")
            
            setTimeout(function () {
                cont2.THROW('error')
            }, 10)
            
        }).CATCH(function (exception) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Simple failing call')
            
            t.ok(this == scope2, "'catchTo' was executed in the correct scope")
            
            t.ok(exception == 'error', 'Correct exception was thrown')
        })
        
        
        
        //======================================================================================================================================================================================================================================================            
        //t.diag('Early failing call')

        var scope3 = {
            name : 'value'
        }
        
        var cont3 = new JooseX.CPS.Continuation()
        
        cont3.setScope(scope3)
        
        cont3.THEN(function (value) {
        })
        
        cont3.TRY(function () {
            
            t.ok(this == scope3, "'task' was executed in the correct scope")
            
            throw 'error3'
            
        }).CATCH(function (exception) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Simple failing call')
            
            t.ok(this == scope3, "'catchTo' was executed in the correct scope")
            
            t.ok(exception == 'error3', 'Correct exception was thrown')
        })
        
        
    })
    
})    