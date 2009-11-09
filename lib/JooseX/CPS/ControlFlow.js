Role('JooseX.CPS.ControlFlow', {
    
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
        }
        
    }
    //eof methods

})