Class('JooseX.CPS.Continuation.TryRetThen', {
    
    
    has : {
        next            : null,
        parent          : { is : 'rw' },
        
        tryFunc         : null,
        tryScope        : null,
        tryArgs         : null,
        
        catchFunc       : null,
        catchScope      : null,
        
        finallyFunc     : null,
        finallyScope    : null,
        
        earlyException  : false
        
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
            
                try {
                    if (me.tryFunc.apply(scope, me.tryArgs || results) !== undefined) throw "Value returned from continued function (use RETURN() instead)" 
                } catch (e) {
                    
                    this.earlyException = true
                    
                    try {
                        this.THROW(e)
                    } catch (e) {
                    }
                    
                } finally {
                    if (this.earlyException) this.doFinally()
                }
                
                
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
        },
        
        
//        THROW : function (exception) {
////            if 
////            
////            this.RETURN()
////            
////            throw(exception)
//            
//            if (this.catchFunc)
//                this.catchFunc.call(this.catchScope, exception)
//            else
//                this.parent.THROW(exception)
//        },
        
        
        CATCH : function (catchFunc, catchScope) {
            if (!this.tryFunc)  throw "Call to 'CATCH' before 'TRY' in [" + this + "]"
            if (!catchFunc)     throw "Invalid parameters for 'CATCH' call in [" + this + "]"
            
            this.catchFunc      = catchFunc
            this.catchScope     = catchScope || this.tryScope
            
            return this 
        },
        
        
        FINALLY : function (finallyFunc, finallyScope) {
            if (!this.tryFunc)  throw "Call to 'FINALLY' before 'TRY' in [" + this + "]"
            if (!finallyFunc)   throw "Invalid parameters for 'FINALLY' call in [" + this + "]"
            
            this.finallyFunc      = finallyFunc
            this.finallyScope     = finallyScope || this.tryScope
            
            return this
        },
        
        
        
//        doFinally : function () {
//        },
        

        
        // Synonyms
        
        then : function () {
            return this.THEN.apply(this, arguments)
        },
        
        
        now : function () {
            return this.NOW.apply(this, arguments)
        },

        
        except : function () {
            return this.CATCH.apply(this, arguments)
        },
        
        
        ensure : function () {
            return this.FINALLY.apply(this, arguments)
        }
    }
    //eof methods

})