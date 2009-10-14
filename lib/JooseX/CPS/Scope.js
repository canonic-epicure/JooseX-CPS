Class('JooseX.CPS.Scope', {
    
    
    has : {
        parent              : null,
        
        tryFunc             : null,
        tryScope            : null,
        tryArgs             : null,
        
        catchFunc           : null,
        catchScope          : null,
        
        finallyFunc         : null,
        finallyScope        : null,
        
        
        thenFunc            : null,
        thenScope           : null,
        
        
        earlyException      : false
    },
    
    
    
    methods : {
        
//        getScope    : function () {
//            return this.scope || (this.parent && this.parent.getScope())
//        },
//        
//        
//        setScope : function (scope) {
//            if (this.scope) throw "Can't redefine the scope for continuation"
//            
//            return this.scope = scope
//        },
//        
//        
//        setParent : function (parent) {
//            throw "Can't redefine the 'parent' for continuation, please provide it during creation"
//        },
//        
//        
//        setReturnTo : function (returnTo) {
//            if (this.returnTo) throw "Can't redefine the 'returnTo' for continuation"
//            
//            return this.returnTo = returnTo
//        },
//        
//        
//        getCatchTo    : function () {
//            return this.catchTo || (this.parent && this.parent.getCatchTo())
//        },
//        
//        
//        setCatchTo : function (catchTo) {
//            if (this.catchTo) throw "Can't redefine the 'catchTo' for continuation"
//            
//            return this.catchTo = catchTo
//        },
        
        
        TRY : function (tryFunc, tryScope, tryArgs) {
            if (!tryFunc || !tryScope) throw "Invalid parameters for 'TRY' call"
            
            this.tryFunc    = tryFunc
            this.tryScope   = tryScope || Joose.top
            this.tryArgs    = tryArgs || []
                
            return this
        },
        
        
        CATCH : function (catchFunc, catchScope) {
            if (!this.tryFunc) throw "Call to 'CATCH' before 'TRY'"
            if (!catchFunc) throw "Invalid parameters for 'CATCH' call"
            
            this.catchFunc      = catchFunc
            this.catchScope     = catchScope || this.tryScope
            
            return this 
        },
        
        
        FINALLY : function (finallyFunc, finallyScope) {
            if (!this.tryFunc) throw "Call to 'FINALLY' before 'TRY'"
            if (!finallyFunc) throw "Invalid parameters for 'FINALLY' call"
            
            this.finallyFunc      = finallyFunc
            this.finallyScope     = finallyScope || this.tryScope
            
            return this
        },
        
        
        THEN : function (thenFunc, thenScope) {
            if (!this.tryFunc) throw "Call to 'THEN' before 'TRY'"
            if (!thenFunc) throw "Invalid parameters for 'THEN' call"
            
            this.thenFunc      = thenFunc
            this.thenScope     = thenScope || this.tryScope
            
            try {
                this.tryFunc.apply(this.tryScope, [].concat(this, this.tryArgs))
                
//                throw "Value returned from CPS method (use RETURN() instead)"
            } catch (e) {
                this.earlyException = true
                this.THROW(e)
            } finally {
                if (this.earlyException) this.doFinally()
            }
        },
        
        
        doFinally : function () {
        },
        
        
        THROW : function (exception) {
            if (this.catchFunc)
                this.catchFunc.call(this.catchScope, this, exception)
            else
                this.parent.THROW(exception)
        },
        
        
        RETURN : function (value) {
            if (this.thenFunc)
                this.thenFunc.call(this.thenScope, this.parent, value)
            else
                this.parent.THROW(exception)
        },
        
        
        
        // Synonyms
        
        then : function () {
            return this.THEN.apply(this, arguments)
        },
        
        
        now : function () {
            return this.THEN.call(this, function () {})
        },

        
        except : function () {
            return this.CATCH.apply(this, arguments)
        }
        
    }

})