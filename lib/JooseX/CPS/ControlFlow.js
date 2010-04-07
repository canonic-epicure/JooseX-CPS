Role('JooseX.CPS.ControlFlow', {
    
    use : [ 'JooseX.CPS.Statement' ],
    
    has : {
        CONT            : null,
        RESULT          : null,
        RESULTS         : null
    },
    
    
    methods : {
        
        TRY : function (func, scope, args) {
            return this.CONT.TRY(func, scope || this, args)
        },
        
        
        AND : function (func, scope, args) {
            return this.CONT.AND(func, scope || this, args)
        },
        
        
        THEN : function (func, scope, args) {
            return this.CONT.THEN(func, scope || this, args)
        },
        
        
        NEXT : function (func, scope, args) {
            return this.CONT.NEXT(func, scope || this, args)
        },
        
        
        NOW : function () {
            var cont = this.CONT
            
            return cont.NOW.apply(cont, arguments)
        },
        
        
        CONTINUE : function () {
            var cont = this.CONT
            
            cont.CONTINUE.apply(cont, arguments)
        },
        
        
        RETURN : function () {
            var cont = this.CONT
            
            cont.RETURN.apply(cont, arguments)
        },
        
        
        THROW : function () {
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
        }
        
//        ,
//        detachScope : function () {
//            this.CONT = new JooseX.CPS.Statement()
//            
//            return this
//        }
        
    }
    //eof methods

})