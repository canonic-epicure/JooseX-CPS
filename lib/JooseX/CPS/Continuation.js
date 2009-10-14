Class('JooseX.CPS.Scope', {
    
    
    has : {
        parent              : null,
        
        tryTo               : null,
        
        scope               : null,
        
        returnTo            : null,
        
        catchTo             : null,
        
        finallyTo           : null
        
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
        
        
        TRY : function (task) {
            if (!task && this.task) 
                this.start()
            else
                if (task && !this.task) {
                    this.task = task
                } else 
                    throw "Invalid call to TRY"
                
            return this
        },
        
        
        CATCH : function (catchTo) {
            this.setCatchTo(catchTo)
            
            if (this.task && this.getReturnTo()) this.start()
            
            return this 
        },
        
        
        FINALLY : function (finallyTo) {
        },
        
        
        THROW : function (exception) {
            this.getCatchTo().call(this.getScope(), exception)
        },
        
        
        THEN : function (returnTo) {
            this.setReturnTo(returnTo)
            
            return this
        },
        
        
        RETURN : function (value) {
            this.getReturnTo().call(this.getScope(), value)
        },
        
        
        start : function () {
            if (!this.returnTo) this.returnTo = function () {}
            
            try {
                this.task.call(this.getScope())
                
//                throw "Value returned from CPS method (use RETURN() instead)"
            } catch (e) {
                this.THROW(e)
            }
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