StartTest(function(t) {
    
	t.plan(20)
    
    var async0 = t.beginAsync()
    
    use('JooseX.CPS.Continuation.TryRetThen', function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JooseX.CPS.Continuation.TryRetThen, "JooseX.CPS.Continuation.TryRetThen is here")
        
        
        var xhrRequest = function (params) {
            
            setTimeout(function () {
                if (params.error)
                    params.errback.call(params.scope || Joose.top, params.value1 || 'value1', params.value2 || 'value2', params)
                else
                    params.callback.call(params.scope || Joose.top, params.value1 || 'value1', params.value2 || 'value2', params)
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
        
        
        //======================================================================================================================================================================================================================================================            
        t.diag('Try/Return/Then used as usual callbacks, chained & nested')
        
        var async3  = t.beginAsync()
        
        var cont3   = new JooseX.CPS.Continuation.TryRetThen()
        
        var scope5  = {}
        
        cont3.TRY(function () {
            
            this.CONT.TRY(function () {
                
                xhrRequest({
                    callback    : this.RETURN,
                    value1      : 'yo'
                })
                
            }).THEN(function (res1) {
                
                if (res1 == 'yo') 
                    this.RETURN('foo')
                else
                    this.RETURN('bar')
                
            })
            
        }, scope5).THEN(function (res) {
            
            t.ok(this == scope5, "Scope was correctly passed into 'THEN'")
            t.ok(res == 'foo', "Control flow was correct")
            
            xhrRequest({
                callback    : this.RETURN,
                value2      : 'yo2'
            })
            
        }).THEN(function (res1, res2, params) {
            
            t.ok(this == scope5, "Scope was correctly propagated")
            t.ok(res2 == 'yo2', "Correct arguments received")
            
            this.RETURN()
            
        }).THEN(function () {
            
            t.endAsync(async3)
            
        })
        
        
        t.endAsync(async0)
    })
    
})    