Role('JooseX.CPS.ControlFlow', {
    
    use : [ 'JooseX.CPS.Continuation' ],
    
    has : {
        CONT            : null,
        RESULT          : null,
        RESULTS         : null
    },
    
    
    methods : {
        
        TRY : function () {
            var cont = this.CONT
            
            return cont.TRY.apply(cont, arguments)
        },
        
        
        THEN : function () {
            var cont = this.CONT
            
            var args = Array.prototype.slice.call(arguments)
            if (!args[1]) args[1] = this
            
            return cont.THEN.apply(cont, args)
        },
        
        
        NEXT : function () {
            var cont = this.CONT
            
            var args = Array.prototype.slice.call(arguments)
            if (!args[1]) args[1] = this
            
            return cont.NEXT.apply(cont, args)
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
            
            cont.CONTINUE.apply(cont, arguments)
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
        
        
        attach : function (to) {
            if (!to.CONT)   throw "Can't attach to [" + to + "] - it doesn't have the active continuation"
            
            this.CONT       = to.CONT
            this.RESULT     = to.RESULT 
            this.RESULTS    = to.RESULTS
            
            return this
        },
        
        
        detach : function () {
            this.CONT = new JooseX.CPS.Continuation()
            
            return this
        }
        
    }
    //eof methods

})