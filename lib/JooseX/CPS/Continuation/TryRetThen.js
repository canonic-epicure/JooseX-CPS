Class('JooseX.CPS.Continuation.TryRetThen', {
    
    
    has : {
        next            : null,
        parent          : { is : 'rw' },
        
        tryFunc         : null,
        tryScope        : null,
        tryArgs         : null
        
//        ,
//        started         : false
    },
    
    
    methods : {
        
        setParent : function (parent) {
            if (this.parent) throw "Can't redefine 'parent' for [" + this + "]"
            
            this.parent = parent
            
            //copying a scope from parent (if it was set on it and we don't have one)
            if (!this.tryScope && parent.tryScope) this.tryScope = parent.tryScope
        },
        
        
        setTry : function (tryFunc, tryScope, tryArgs) {
            if (!tryFunc)       throw "Wrong parameters for 'TRY' in [" + this + "]"
            if (this.tryFunc)   throw "Can't redefine 'TRY' for [" + this + "]" 
            
            this.tryFunc        = tryFunc
            this.tryScope       = tryScope || this.tryScope
            this.tryArgs        = tryArgs
        },
        
        
        TRY : function (tryFunc, tryScope, tryArgs) {
            this.setTry(tryFunc, tryScope, tryArgs)
                
            return this
        },
        
        
        RETURN : function () {
            if (this.parent) {
                var parent = this.parent
                delete this.parent
                
                parent.unnest(this, arguments)
            }
        },
        
        
        THEN : function (thenFunc, thenScope, thenArgs) {
            if (typeof thenFunc == 'function') {
                var next = this.nest()
                
                next.TRY(thenFunc, thenScope, thenArgs)
            } else 
                if (thenFuns instanceof JooseX.CPS.Continuation.TryRetThen) {
                    var next = thenFunc
                    next.setParent(this)
                    next.isWrapped = true
                } else
                    throw "Incorrect parameters supplied to 'THEN' in [" + this + "]"
                
            
            this.next = next
            
            //only starting at the root level (no parent) or if we aren't the parent's next 
            if (!this.parent || !(this.parent.next == this)) this.start()
            
            return next
        },
        
        
        NOW : function () {
            return this.THEN(function () {
                this.CONT.RETURN(this.RESULT)
            })
        },
        
        
        start : function () {
            var results = arguments
            
            var cont    = this.nest()
            
            var scope   = this.tryScope || Joose.top
            
            
//            this.started = true
            
            var me = this
            
            setTimeout(function() {
                var beforeResult    = scope.RESULT
                var beforeResults   = scope.RESULTS
                var beforeCont      = scope.CONT
                var beforeReturn    = scope.RETURN
                
                scope.RESULT        = results[0]
                scope.RESULTS       = results
                scope.CONT          = cont
                
                scope.RETURN = function () {
                    cont.RETURN.apply(cont, arguments)
                }
            
                me.tryFunc.apply(scope, me.tryArgs || results)
                
                scope.RESULTS   = beforeResults
                scope.RESULT    = beforeResult
                scope.CONT      = beforeCont
                scope.RETURN    = beforeReturn
            }, 0)
        },
        
        
        nest : function () {
            return new this.constructor({
                parent : this
            })
        },
        
        
        unnest : function (returned, values) {
            if (returned == this.next || !this.next) {
                delete this.next
                this.RETURN.apply(this, values)
            } else
                this.sync(returned, values)
        },
        
        
        sync : function (returned, values) {
            var next = this.next
            
            next.start.apply(next, values)
        }
        
    }

})