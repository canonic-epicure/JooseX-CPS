Class('JooseX.CPS.Continuation', {
    
    has : {
        nested          : Joose.Array,
        
        nextCont        : null,
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
            
            //remember the 1st passed scope only
            this.tryScope       = this.tryScope || tryScope || Joose.top
            
            this.nested.push({
                func : tryFunc, 
                scope : tryScope || this.tryScope, //explicitly passed scope has the highest priority  
                args : tryArgs
            })
        },
        
        
        TRY : function (tryFunc, tryScope, tryArgs) {
            this.setTry(tryFunc, tryScope, tryArgs)
                
            return this
        },
        
        
        THEN : function () {
            return this.TRY.apply(this, arguments)
        },
        
        
        RETURN : function () {
            if (this.parent) {
                var parent = this.parent
                delete this.parent
                
                parent.unnest(this, arguments, true)
            }
        },
        
        
        CONTINUE : function () {
            if (this.parent) {
                var parent = this.parent
                delete this.parent
                
                parent.unnest(this, arguments, false)
            }
        },
        
        
        NEXT : function (nextFunc, nextScope, nextArgs) {
            if (!this.nested.length) throw "Call to 'NEXT' before 'TRY' in [" + this + "]"
            
            if (typeof nextFunc == 'function') {
                var next = this.nest()
                
                next.TRY(nextFunc, nextScope, nextArgs)
            } else 
                if (nextFunc instanceof JooseX.CPS.Continuation) {
                    var next = nextFunc
                    next.setParent(this)
                } else
                    throw "Incorrect parameters supplied to 'NEXT' in [" + this + "]"
                
            
            this.nextCont = next
            
            //only starting if we aren't the parent's next 
            if (!this.isNext()) this.start()
            
            return next
        },
        
        
        isNext : function () {
            return this.parent && this.parent.nextCont == this
        },
        
        
        NOW : function () {
            return this.NEXT(function () {
                var cont = this.CONT
                
                cont.CONTINUE.apply(cont, arguments)
            })
        },
        
        
        start : function () {
            if (!this.nested.length) throw "Can't start the continuation - there were no call to 'TRY'"
            
            var results = arguments
            
            var cont    = this.nest()
            
            var current = this.nested.shift()
            
            var scope   = current.scope
            
            var me      = this
            
            setTimeout(function() {
                var beforeResult    = scope.RESULT
                var beforeResults   = scope.RESULTS
                var beforeCont      = scope.CONT
                var beforeReturn    = scope.CONTINUE
                var beforeThrow     = scope.THROW
                
                scope.RESULT        = results[0]
                scope.RESULTS       = results
                scope.CONT          = cont
                
                scope.CONTINUE = function () {
                    cont.CONTINUE.apply(cont, arguments)
                }
                
                scope.THROW = function () {
                    cont.THROW.apply(cont, arguments)
                }
                
                try {
                    if (current.func.apply(scope, current.args || results) !== undefined) throw "ERROR: Value returned from continued function (use CONTINUE() instead)" 
                } catch (e) {
                    
                    if (me.passThroughEx) throw e
                    
                    cont.THROW(e)
                } 
                
                scope.THROW     = beforeThrow 
                scope.RESULTS   = beforeResults
                scope.RESULT    = beforeResult
                scope.CONT      = beforeCont
                scope.CONTINUE  = beforeReturn
            }, 0)
        },
        
        
        nest : function () {
            return new this.constructor({
                parent : this
            })
        },
        
        
        unnest : function (returned, values, isReturn) {
            if (returned == this.nextCont || !this.nextCont) {
                //moving back                
                delete this.nextCont
                this.CONTINUE.apply(this, values)
            } else {
                //moving forward
                
                if (isReturn) this.nested = []
                
                this.sync(returned, values)
            }
        },
        
        
        sync : function (returned, values) {
            if (this.nested.length) {
                this.start.apply(this, values)
                
                return
            }
            
            var next = this.nextCont
            
            this.handleFinally(next.start, next, values)
        },
        
        
        handleThrow : function (source, values) {
            if (this.catchFunc) {
                
                var catchFunc = this.catchFunc
                delete this.catchFunc
                
                var me = this
                
                this.nest().TRY(catchFunc, this.catchScope, values).NEXT(function () {
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
            if (!catchFunc)          throw "Invalid parameters for 'CATCH' call in [" + this + "]"
            if (this.catchFunc)      throw "Can't redefine 'CATCH' for [" + this + "]"
            
            this.catchFunc      = catchFunc
            this.catchScope     = catchScope || this.tryScope
            
            return this 
        },
        
        
        FINALLY : function (finallyFunc, finallyScope) {
            if (!this.nested.length) throw "Call to 'FINALLY' before 'TRY' in [" + this + "]"
            if (!finallyFunc)        throw "Invalid parameters for 'FINALLY' call in [" + this + "]"
            if (this.finallyFunc)    throw "Can't redefine 'FINALLY' for [" + this + "]"
            
            this.finallyFunc      = finallyFunc
            this.finallyScope     = finallyScope || this.tryScope
            
            return this
        },
        
        
        handleFinally : function (then, scope, args) {
            
            if (this.finallyFunc) {
                
                var finallyFunc = this.finallyFunc
                delete this.finallyFunc
                
                this.nest().TRY(finallyFunc, this.finallyScope, []).NEXT(function () {
                    then.apply(scope, args)
                })
                
            } else
                then.apply(scope, args)
        },

        
        // Synonyms
        then : function () {
            return this.then.apply(this, arguments)
        },
        
        
        next : function () {
            return this.next.apply(this, arguments)
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