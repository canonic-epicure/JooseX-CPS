StartTest(function(t) {
    
	t.plan(19)
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(JooseX.CPS.Continuation, "JooseX.CPS.Continuation is here")
    

    //======================================================================================================================================================================================================================================================            
    //t.diag("'TRY' nesting")
    
    var async4      = t.beginAsync()
    var cont4       = new JooseX.CPS.Continuation()
    var scope4      = { toString : function () { return 'scope4'} }
    var scope4Then  = { toString : function () { return 'scope4Then'} }

    
    cont4.TRY(function () {
        //======================================================================================================================================================================================================================================================            
        t.diag("'TRY' nesting - TRY")
        
        t.ok(this == scope4, "Scope was correctly passed into 'TRY' #2")
        
        var CONT = this.CONT
        
        setTimeout(function () {
        
            CONT.TRY(function () {
                
                t.ok(this == scope4, "Scope was correctly passed into nested 'TRY' #1")
                
                this.CONT.CONTINUE('returnTo')
            }).NOW()
            
        }, 10)
        
    }, scope4).andTHEN(function (res) {
        //======================================================================================================================================================================================================================================================            
        t.diag("'TRY' nesting - THEN")
        
        t.ok(this == scope4Then, "Scope was correctly passed into 'THEN'")
        
        t.ok(res == 'returnTo', 'THEN was reached from the nested TRY with the correct result')
        
        t.endAsync(async4)
        
    }, scope4Then)

    
    
    //======================================================================================================================================================================================================================================================            
    //t.diag('Try/Then nesting')
    
    var async5      = t.beginAsync()
    var cont5       = new JooseX.CPS.Continuation()
    var scope5      = {}
    
    cont5.TRY(function () {
        //======================================================================================================================================================================================================================================================            
        t.diag('Try/Then nesting - TRY')
        
        t.ok(this == scope5, "Scope was correctly passed into 'TRY' #3")
        
        var CONT = this.CONT
        
        
        setTimeout(function () {
            
            CONT.TRY(function () {
                
                t.ok(this == scope5, "Scope was correctly passed into nested 'TRY' #2")
                
                this.CONT.CONTINUE('returnTo2')
                
            }).THEN(function (result) {
                
                t.ok(this == scope5, "Scope was correctly passed into nested 'NEXT'")
                
                this.CONT.CONTINUE(result)
            }).NOW()
            
        }, 10)
        
    }, scope5).andTHEN(function (result) {
        //======================================================================================================================================================================================================================================================            
        t.diag('Try/Then nesting - NEXT')
        
        t.ok(this == scope5, "Scope was correctly passed into outer 'NEXT'")
        
        t.ok(result == 'returnTo2', 'NEXT was reached from the nested TRY/NEXT with the correct result :)')
        
        t.endAsync(async5)
    })
    
    
    
    //======================================================================================================================================================================================================================================================            
    //t.diag('More Try/Then nesting')
    
    var async6  = t.beginAsync()
    var cont6   = new JooseX.CPS.Continuation()
    var scope6  = {}
    
    cont6.TRY(function () {
        
        var CONT = this.CONT
        
        setTimeout(function () {
            
            CONT.TRY(function () {
                
                this.CONT.CONTINUE('returnTo2')
                
            }).THEN(function (result) {
                //======================================================================================================================================================================================================================================================            
                t.diag('More Try/Then nesting - TRY')
                
                t.ok(result == 'returnTo2', 'NEXT was reached from the nested TRY with the correct result')
                
                
                this.CONT.TRY(function () {
                    
                    t.ok(this == scope6, "Scope was correctly passed into most nested 'TRY'")
                    
                    this.CONT.CONTINUE('result3')
                    
                }).andThen(function (result) {
                    
                    t.ok(this == scope6, "Scope was correctly passed into most nested 'NEXT'")
                    
                    t.ok(result == 'result3', 'Another NEXT was reached from the nested TRY with the correct result')
                    
                    this.CONT.CONTINUE('result4')
                })
                
            }).NOW()
            
        }, 10)
        
    }, scope6).THEN(function (result) {
        //======================================================================================================================================================================================================================================================            
        t.diag('More Try/Then nesting - NEXT')
        
        t.ok(this == scope6, "Scope was correctly passed into outer 'NEXT'")
        
        t.ok(result == 'result4', 'Outer NEXT was reached from the nested TRY/NEXT/THEN with the correct result')
        
        
        this.CONT.TRY(function () {
            
            t.ok(this == scope6, "Scope was correctly passed into nested 'TRY' of outer 'NEXT'")
            
            this.CONT.CONTINUE('result5')
            
        }).THEN(function (result) {
            
            t.ok(this == scope6, "Scope was correctly passed into nested 'NEXT' of outer 'NEXT'")
            
            t.ok(result == 'result5', '.. as well as result')
            
            this.CONT.CONTINUE()
            
            t.endAsync(async6)
        }).NOW()
    }).NOW()

})    