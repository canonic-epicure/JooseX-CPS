Role('JooseX.CPS.ControlFlow', {
    
    use : [ 'JooseX.CPS.Continuation' ],
    
    has : {
        CONT            : null,
        RESULT          : null,
        RESULTS         : null
    },
    
    
    methods : {
        
        TRY : function (func, scope, args) {
            var cont = this.CONT
            
            scope = scope || this
            
            return cont.TRY.call(cont, func, scope, args)
        },
        
        
        THEN : function (func, scope, args) {
            var cont = this.CONT
            
            scope = scope || this
            
            return cont.THEN.call(cont, func, scope, args)
        },
        
        
        NEXT : function (func, scope, args) {
            var cont = this.CONT
            
            scope = scope || this
            
            return cont.NEXT.call(cont, func, scope, args)
        },
        
        
        NOW : function () {
            this.CONT.NOW()
        },
        
        
        CONTINUE : function () {
            var cont = this.CONT
            
            cont.CONTINUE.apply(cont, arguments)
        },
        
        
        RETURN : function () {
            var cont = this.CONT
            
            cont.RETURN.apply(cont, arguments)
        },
        
        
        THROW : function (exception) {
            var cont = this.CONT
            
            cont.THROW.apply(cont, arguments)
        },
        
        
        getCONTINUE : function () {
            return this.CONT.getCONTINUE()
        },
        
        
        getRETURN : function () {
            return this.CONT.getRETURN()
        },
        
        
        getTHROW : function () {
            return this.CONT.getTHROW()
        },
        
        
        detachScope : function () {
            this.CONT = new JooseX.CPS.Continuation()
            
            return this
        }
        
    }
    //eof methods

})