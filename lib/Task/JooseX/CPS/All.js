Class('JooseX.CPS.Statement', {
    
    has : {
        parent          : null,
        
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

            var me = glob.__GLOBAL_CNT__ = scope.CONT = this
            
            try {
                if (this.func.apply(scope, args) !== undefined) throw "ERROR: Value returned from continued function (use `CONTINUE(value)` instead)" 
            } catch (e) {
                me.THROW(e)
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
//        statementClass  : Joose.I.FutureClass('JooseX.CPS.Statement'),
//        
//        parent          : { is : 'rw' },
//        
//        defaultScope        : null,
        
//        
//        statements          : Joose.I.Array,
//
//        catchStatement      : null,
//        finallyStatement    : null
    },
    
    
    methods : {
        
//        setParent : function (parent) {
//            if (this.parent) throw "Can't redefine 'parent' for [" + this + "]"
//            
//            this.parent = parent
//            
//            this.defaultScope = this.defaultScope || parent.defaultScope
//        },
//        
//        
//        deriveChild : function () {
//            return new this.constructor({
//                parent : this
//            })
//        },
//        
//        
//        TRY : function (func, scope, args) {
//            if (!func)                  throw "Invalid parameters for 'TRY' in [" + this + "]"
//            
//            if (this.catchStatement || this.finallyStatement) {
//                var child = this.deriveChild()
//                
//                return child.TRY.apply(child, arguments)
//            }
//            
//            this.defaultScope = scope || this.defaultScope
//            
//            this.statements.push(new this.statementClass({
//                func    : func,
//                scope   : this.defaultScope || Joose.top,
//                args    : args
//            }))
//                
//            return this
//        },
//        
//        
//        CATCH : function (func, scope) {
//            if (!func)                  throw "Invalid parameters for 'CATCH' in [" + this + "]"
//            if (this.catchFunc)         throw "Can't redefine 'CATCH' for [" + this + "]"
//            
//            this.catchFunc      = func
//            this.catchScope     = scope || this.scope
//            
//            return this 
//        },
//        
//        
//        FINALLY : function (func, scope) {
//            if (!func)                  throw "Invalid parameters for 'FINALLY' in [" + this + "]"
//            if (this.finallyFunc)       throw "Can't redefine 'FINALLY' for [" + this + "]"
//            
//            this.finallyFunc      = func
//            this.finallyScope     = scope || this.scope
//            
//            return this
//        },
//        
//        
//        THEN : function () {
//            return this.TRY.apply(this, arguments)
//        },
//        
//
//        
//        entry : function () {
//            this.statement.run(this)
//        },
//        
//        
//        leave : function () {
//            
//            if (this.finallyStatement) {
//                var child = this.deriveChild()
//                
//                child.statement = this.finallyStatement
//                
//                child.entry()
//            }
//        },
//        
//        
//        CONTINUE : function () {
//            this.leave.apply(this, arguments)
//        }
    }
});
