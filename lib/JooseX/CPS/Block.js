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
})