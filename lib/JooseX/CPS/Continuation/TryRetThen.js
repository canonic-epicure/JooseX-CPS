Class('JooseX.CPS.Continuation.TryRetThen', {
    
    has : {
        nested          : Joose.Array,
        
        next            : null,
        parent          : { is : 'rw' },
        
        tryScope        : null,
        
        catchFunc       : null,
        catchScope      : null,
        
        finallyFunc     : null,
        finallyScope    : null,
        
        passThroughEx   : false
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
            
            this.tryScope       = tryScope || this.tryScope || Joose.top
            
            this.nested.push({
                func : tryFunc, 
                scope : this.tryScope, 
                args : tryArgs
            })
        },
        
        
        TRY : function (tryFunc, tryScope, tryArgs) {
            this.setTry(tryFunc, tryScope, tryArgs)
                
            return this
        },
        
        
        NEXT : function () {
            return this.TRY.apply(this, arguments)
        },
        
        
        RETURN : function () {
            if (this.parent) {
                var parent = this.parent
                delete this.parent
                
                parent.unnest(this, arguments)
            }
        },
        
        
        THEN : function (thenFunc, thenScope, thenArgs) {
            if (!this.nested.length) throw "Call to 'THEN' before 'TRY' in [" + this + "]"
            
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
            
            //only starting if we aren't the parent's next 
            if (!this.isNext()) this.start()
            
            return next
        },
        
        
        isNext : function () {
            return this.parent && this.parent.next == this
        },
        
        
        NOW : function () {
            return this.THEN(function () {
                var cont = this.CONT
                
                cont.RETURN.apply(cont, arguments)
            })
        },
        
        
        start : function () {
            if (!this.nested.length) throw "Can't start the continuation"
            
            var results = arguments
            
            var cont    = this.nest()
            
            var current = this.nested.shift()
            
            var scope   = current.scope
            
            var me      = this
            
            setTimeout(function() {
                var beforeResult    = scope.RESULT
                var beforeResults   = scope.RESULTS
                var beforeCont      = scope.CONT
                var beforeReturn    = scope.RETURN
                var beforeThrow     = scope.THROW
                
                scope.RESULT        = results[0]
                scope.RESULTS       = results
                scope.CONT          = cont
                
                scope.RETURN = function () {
                    cont.RETURN.apply(cont, arguments)
                }
                
                scope.THROW = function () {
                    cont.THROW.apply(cont, arguments)
                }
                
                try {
                    if (current.func.apply(scope, current.args || results) !== undefined) throw "Value returned from continued function (use RETURN() instead)" 
                } catch (e) {
                    
                    if (me.passThroughEx) throw e
                    
                    cont.THROW(e)
                } 
                
                scope.THROW     = beforeThrow 
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
                //moving back                
                delete this.next
                this.RETURN.apply(this, values)
            } else
                //moving forward
                this.sync(returned, values)
        },
        
        
        sync : function (returned, values) {
            if (this.nested.length) {
                this.start.apply(this, values)
                
                return
            }
            
            var next = this.next
            
            this.handleFinally(next.start, next, values)
        },
        
        
        handleThrow : function (source, values) {
            if (this.catchFunc) {
                
                var catchFunc = this.catchFunc
                delete this.catchFunc
                
                var me = this
                
                this.nest().TRY(catchFunc, this.catchScope, values).THEN(function () {
                    me.nested = []
                    
                    me.unnest(source, arguments)
                })
                
            } else
                this.handleFinally(this.THROW, this, values)
        },
        
        
        THROW : function (exception) {
            if (this.parent && !this.isNext())
                this.parent.handleThrow(this, arguments)
            else {
                this.passThroughEx = true
                
                throw exception
            }
        },
        
        
        CATCH : function (catchFunc, catchScope) {
            if (!this.nested.length) throw "Call to 'CATCH' before 'TRY' in [" + this + "]"
            if (!catchFunc)     throw "Invalid parameters for 'CATCH' call in [" + this + "]"
            if (this.catchFunc) throw "Can't redefine 'CATCH' for [" + this + "]"
            
            this.catchFunc      = catchFunc
            this.catchScope     = catchScope || this.tryScope
            
            return this 
        },
        
        
        FINALLY : function (finallyFunc, finallyScope) {
            if (!this.nested.length) throw "Call to 'FINALLY' before 'TRY' in [" + this + "]"
            if (!finallyFunc)       throw "Invalid parameters for 'FINALLY' call in [" + this + "]"
            if (this.finallyFunc)   throw "Can't redefine 'FINALLY' for [" + this + "]"
            
            this.finallyFunc      = finallyFunc
            this.finallyScope     = finallyScope || this.tryScope
            
            return this
        },
        
        
        handleFinally : function (then, scope, args) {
            
            if (this.finallyFunc) {
                
                var finallyFunc = this.finallyFunc
                delete this.finallyFunc
                
                this.nest().TRY(finallyFunc, this.finallyScope, []).THEN(function () {
                    then.apply(scope, args)
                })
                
            } else
                then.apply(scope, args)
        },

        
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