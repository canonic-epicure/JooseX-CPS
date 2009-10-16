StartTest(function(t) {
    
	t.plan(16)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        
        
        var xhrRequest = function (params) {
            
            setTimeout(function () {
                params.callback.call(params.scope || Joose.top, 'value1', 'value2', params)
            }, 5)
        }
        
        
        //======================================================================================================================================================================================================================================================            
        t.diag('Try/Return/Then used as usual callbacks')
        
        var async1  = t.beginAsync()
        
        var cont1   = new JooseX.CPS.Continuation.TryRetThen()
        var scope1  = {}
        var scope2  = {}
        
        cont1.TRY(function () {
            
            t.ok(this == scope1, "Scope was correctly passed into 'TRY'")
            
            xhrRequest({
                callback    : this.RETURN,
                scope       : scope2
            })
            
        }, scope1).THEN(function (result1, result2, params) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Try/Return/Then used as usual callbacks - THEN')
            
            t.ok(this == scope2, "Scope was correctly passed into 'THEN'")
            
            t.ok(this.CONT.parent.parent == cont1, "Continuation is next for the one nested into 'cont1'")
            
            t.ok(result1 == 'value1', 'Parameter for callback was passed to wrapper function #1')
            t.ok(result2 == 'value2', 'Parameter for callback was passed to wrapper function #2')
            t.ok(params.scope == scope2, 'Parameter for callback was passed to wrapper function #3')
            
            t.endAsync(async1)
            
        }, scope2)

        
        
        //======================================================================================================================================================================================================================================================            
        t.diag('Try/Return/Then used as usual callbacks with RESULTS')
        
        var async2  = t.beginAsync()
        
        var cont2   = new JooseX.CPS.Continuation.TryRetThen()
        var scope3  = {}
        var scope4  = {}
        
        cont2.TRY(function () {
            
            t.ok(this == scope3, "Scope was correctly passed into 'TRY' #2")
            
            xhrRequest({
                callback    : this.RETURN,
                scope       : scope4
            })
            
        }, scope3).THEN(function (r1, r2, r3) {
            //======================================================================================================================================================================================================================================================            
            t.diag('Try/Return/Then used as usual callbacks - THEN')
            
            t.ok(this == scope4, "Scope was correctly passed into 'THEN'")
            
            t.ok(r1 == null && r2 == null && r3 == null, 'Empty array was provided as arguments for THEN')
            
            t.ok(this.CONT.parent.parent == cont2, "Continuation is next for the one nested into 'cont2'")
            
            t.ok(this.RESULT == 'value1', "'RESULT' is aliased to 1st argument in the callback called actually")
            
            t.ok(this.RESULTS[0] == this.RESULT, "'RESULT' is alias for 'RESULTS[1]' actually")
            t.ok(this.RESULTS[1] == 'value2', "Second parameter for callback was passed to 'RESULTS[1]'")
            t.ok(this.RESULTS[2].scope == scope4, "Third parameter for callback was passed to 'RESULTS[2]'")
            
            t.ok(this.RESULTS.length == 3, "No extra params appeared")
            
            t.endAsync(async2)
            
        }, scope4, [])
        
        
        t.endAsync(async0)
    })
    
})    