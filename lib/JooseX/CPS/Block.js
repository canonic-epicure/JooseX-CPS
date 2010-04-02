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
})