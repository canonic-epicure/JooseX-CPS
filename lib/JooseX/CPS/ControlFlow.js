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
            
            return cont.CONTINUE.apply(cont, arguments)
        },
        
        
        RETURN : function () {
            var cont = this.CONT
            
            return cont.CONTINUE.apply(cont, arguments)
        },
        
        
        THROW : function (exception) {
            var cont = this.CONT
            
            return cont.THROW.apply(cont, arguments)
        },
        
        
        getCONTINUE : function () {
            var cont = this.CONT
            
            return function () {
                cont.CONTINUE.apply(cont, arguments)
            }
        },
        
        
        getRETURN : function () {
            var cont = this.CONT
            
            return function () {
                cont.RETURN.apply(cont, arguments)
            }
        },
        
        
        getTHROW : function () {
            var cont = this.CONT
            
            return function () {
                cont.THROW.apply(cont, arguments)
            }
        }
        
    }
    //eof methods

})