Class('JooseX.CPS.Statement', {
    
    has : {
        parent          : { is : 'rw' },
        
        entered         : false,
        leaved          : false,
        
        func            : null,
        scope           : null,
        args            : null,
        
        nextFunc        : null,
        
        catchFunc       : null,
        catchScope      : null,
        
        finallyFunc     : null,
        finallyScope    : null
    },
    
    
    methods : {
        
        setParent : function (parent) {
            if (this.entered) throw "Can't redefine 'parent' for [" + this + "] - its already started"
            
            this.parent = parent
        },
        
        
        deriveChild : function (config) {
            config          = config || {}
            config.parent   = this
            
            return new this.constructor(config)
        },
        
        
        getNextFunc : function () {
            return this.nextFunc || this.parent && this.parent.getNextFunc()
        },
        
        
        getScope    : function () {
            return this.scope || this.parent && this.parent.getScope() || Joose.top
        },
        
        
        entry : function () {
            if (this.entered)   throw "Can't re-enter the continuation + [" + this + "]"
            if (!this.func)     throw "Can't enter the continuation + [" + this + "] - no function supplied"
            
            this.entered    = true


            var args        = arguments.length && arguments || this.args || []
            var scope       = this.getScope() 
            
            var glob        = Joose.top
            
            
            var previousCont    = glob.__GLOBAL_CNT__

            var cont = glob.__GLOBAL_CNT__ = scope.CONT = this.deriveChild()
            
            try {
                if (this.func.apply(scope, args) !== undefined) throw "ERROR: Value returned from continued function (use `CONTINUE(value)` instead)" 
            } catch (e) {
                cont.THROW(e)
            } finally {
                glob.__GLOBAL_CNT__ = scope.CONT = previousCont
            }
        },
        

        
        leave : function () {
            if (this.leaved)   throw "Can't re-leave the continuation + [" + this + "]"

            this.leaved         = true
            

            var args            = arguments
            
            var finallyFunc     = this.finallyFunc
            var nextFunc        = this.getNextFunc()
            
            if (finallyFunc) {
                
                var finallyStatement = this.deriveChild({
                    func        : finallyFunc,
                    scope       : this.finallyScope || this.getScope(),
                    
                    nextFunc    : function () {
                        nextFunc.apply(Joose.top, args)
                    }
                })
                
                finallyStatement.entry()
                
                return
            }
            
            if (nextFunc) nextFunc.apply(Joose.top, args)
        },
        
        
        THROW : function (exception) {
            var args        = arguments
            
            var catchFunc   = this.catchFunc
            
            if (catchFunc) {
                delete this.catchFunc
                
                var me = this
                
                var catchStatement = this.deriveChild({
                    func        : catchFunc,
                    scope       : this.catchScope || this.getScope(),
                    args        : args,
                    
                    nextFunc    : function () {
                        me.leave()
                    }
                })
                
                catchStatement.entry()

                return
            } 
            
            var parent      = this.parent
            
            if (parent) {
                this.nextFunc = function () {
                    parent.THROW.apply(parent, args)
                }
                
                this.leave()
                
                return
            } 
            
            throw exception
        },
        
        
        CONTINUE : function () {
            return this.leave.apply(this, arguments)
        }
        
    }
});
Class('JooseX.CPS.Block', {
    
    isa : JooseX.CPS.Statement,
    
    
    has : {
        previous            : null,
        
        statements          : Joose.I.Array
    },
    
    
    have : {
        func                : function () {
            var statements = this.statements
            
            if (statements.length) 
                statements[0].entry.apply(statements[0], arguments)
            else
                this.leave.apply(this, arguments)
        }
    },
    
    
    after : {
        initialize : function () {
            this.scope      = this
        }
    },
    
    
    before : {
        
        entry : function () {
            
            var previousStatement = null
            
            Joose.A.each(this.statements, function (statement) {
                if (previousStatement) previousStatement.nextFunc = function () {
                    statement.entry.apply(statement, arguments)
                }
                
                previousStatement = statement
            })
        }
    },
    
    
    methods : {
        
        deriveSibling : function (config) {
            config          = config || {}
            config.parent   = this.parent
            config.previous = this
            
            return new this.constructor(config)
        },
        
        
        TRY : function (func, scope, args) {
            if (this.leaved)            throw "Can't call 'TRY' for [" + this + "] - its already leaved"
            if (!func)                  throw "Invalid parameters for 'TRY' in [" + this + "]"
            
            if (this.catchFunc || this.finallyFunc) return this.NEXT.apply(this, arguments)
            
            this.statements.push(this.deriveChild({
                func    : func,
                scope   : scope,
                args    : args
            }))
                
            return this
        },
        
        
        THEN : function () {
            return this.TRY.apply(this, arguments)
        },
        
        
        CATCH : function (func, scope) {
            if (this.leaved)            throw "Can't call 'CATCH' for [" + this + "] - its already leaved"
            if (!func)                  throw "Invalid parameters for 'CATCH' in [" + this + "]"
            if (this.catchFunc)         throw "Can't redefine 'CATCH' for [" + this + "]"
            
            this.catchFunc      = func
            this.catchScope     = scope
            
            return this 
        },
        
        
        FINALLY : function (func, scope) {
            if (this.leaved)            throw "Can't call 'FINALLY' for [" + this + "] - its already leaved"
            if (!func)                  throw "Invalid parameters for 'FINALLY' in [" + this + "]"
            if (this.finallyFunc)       throw "Can't redefine 'FINALLY' for [" + this + "]"
            
            this.finallyFunc      = func
            this.finallyScope     = scope
            
            return this
        },
        
        
        
        NEXT : function (func, scope, args) {
            if (this.leaved)            throw "Can't call 'NEXT' for [" + this + "] - its already leaved"
            
            var next = this.deriveSibling()
            
            this.nextFunc = function () {
                next.entry.apply(next, arguments)
            }
            
            return next.TRY(func, scope, args)
        },
        
        
        NOW : function () {
            var root = this.getNearestNotEntered()
            
            if (!root)                  throw "Can't launch  [" + this + "]"
            
            root.entry.apply(root, arguments)
        },
        
        
        getNearestNotEntered : function () {
            if (this.entered) return 
            
            var prev = this.previous || this.parent 
            
            if (prev) {
                var root = prev.getNearestNotEntered()
                
                if (root) return root
            }
            
            return this
        }
        
    }
});
