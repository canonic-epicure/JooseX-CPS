Role('JooseX.CPS.ControlFlow', {
    
    use : [ 'JooseX.CPS.Continuation' ],
    
    methods : {
        
        __getCONT__ : function () {
            var CNT = this.__CNT__
            
            if (CNT) {
                delete this.__CNT__
                
                return CNT
            }
            
            return this.CONT
        },
        
        
        TRY : function (func, scope, args) {
            return this.__getCONT__().TRY(func, scope || this, args)
        },
        
        
        AND : function (func, scope, args) {
            return this.__getCONT__().AND(func, scope || this, args)
        },
        
        
        ANDMAX : function (num) {
            return this.__getCONT__().ANDMAX(num)
        },
        
        
        AND_NOEX : function () {
            return this.__getCONT__().AND_NOEX()
        },
        
        
        THEN : function (func, scope, args) {
            return this.__getCONT__().THEN(func, scope || this, args)
        },
        
        
        andTHEN : function (func, scope, args) {
            return this.__getCONT__().andTHEN(func, scope || this, args)
        },
        
        
        NEXT : function (func, scope, args) {
            return this.__getCONT__().NEXT(func, scope || this, args)
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
        
    }
    //eof methods

})