StartTest(function(t) {
    
	t.plan(16)
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.CPS.Continuation, "JooseX.CPS.Continuation is here")
    
    
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
    
    var cont1   = new JooseX.CPS.Continuation()
    var scope1  = {}
    var scope2  = {}
    
    cont1.TRY(function () {
        
        t.ok(this == scope1, "Scope was correctly passed into 'TRY'")
        
        xhrRequest({
            callback    : this.CONT.getCONTINUE(),
            scope       : scope2
        })
        
    }, scope1).NEXT(function (result1, result2, params) {
        //======================================================================================================================================================================================================================================================            
        t.diag('Try/Return/Then used as usual callbacks - NEXT')
        
        t.ok(this == scope2, "Scope was correctly passed into 'NEXT'")
        
        t.ok(result1 == 'value1', 'Parameter for callback was passed to wrapper function #1')
        t.ok(result2 == 'value2', 'Parameter for callback was passed to wrapper function #2')
        t.ok(params.scope == scope2, 'Parameter for callback was passed to wrapper function #3')
        
        t.endAsync(async1)
        
    }, scope2).NOW()

    
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Try/Return/Then used as usual callbacks with RESULTS')
    
    var async2  = t.beginAsync()
    
    var cont2   = new JooseX.CPS.Continuation()
    var scope3  = {}
    var scope4  = {}
    
    cont2.TRY(function () {
        
        t.ok(this == scope3, "Scope was correctly passed into 'TRY' #2")
        
        xhrRequest({
            callback    : this.CONT.getCONTINUE(),
            scope       : scope4
        })
        
    }, scope3).NEXT(function (r1, r2, r3) {
        //======================================================================================================================================================================================================================================================            
        t.diag('Try/Return/Then used as usual callbacks - NEXT')
        
        t.ok(this == scope4, "Scope was correctly passed into 'NEXT'")
        
        t.ok(r1 == 'value1', "First parameter for callback was passed to 'r1'")
        t.ok(r2 == 'value2', "Second parameter for callback was passed to 'r1'")
        t.ok(r3.scope == scope4, "Third parameter for callback was passed to 'r3'")
        
        t.ok(arguments.length == 3, "No extra params appeared")
        
        t.endAsync(async2)
        
    }, scope4).NOW()
    
    
    //======================================================================================================================================================================================================================================================            
    t.diag('Try/Return/Then used as usual callbacks, chained & nested')
    
    var async3  = t.beginAsync()
    
    var cont3   = new JooseX.CPS.Continuation()
    
    var scope5  = {}
    
    cont3.TRY(function () {
        
        this.CONT.TRY(function () {
            
            xhrRequest({
                callback    : this.CONT.getCONTINUE(),
                value1      : 'yo'
            })
            
        }).NEXT(function (res1) {
            
            if (res1 == 'yo') 
                this.CONT.CONTINUE('foo')
            else
                this.CONT.CONTINUE('bar')
            
        }).NOW()
        
    }, scope5).NEXT(function (res) {
        
        t.ok(this == scope5, "Scope was correctly passed into 'NEXT'")
        t.ok(res == 'foo', "Control flow was correct")
        
        xhrRequest({
            callback    : this.CONT.getCONTINUE(),
            value2      : 'yo2'
        })
        
    }).NEXT(function (res1, res2, params) {
        
        t.ok(this == scope5, "Scope was correctly propagated")
        t.ok(res2 == 'yo2', "Correct arguments received")
        
        this.CONT.CONTINUE()
        
    }).NEXT(function () {
        
        t.endAsync(async3)
        
    }).NOW()
    
})    