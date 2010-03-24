Class('JooseX.CPS.Context', {
    
    use     : 'JooseX.CPS.Statement',
    
    
    has : {
        parent          : { is : 'rw' },
        
        scope           : null,
        
        statement       : null,
        
        catchStatement      : null,
        finallyStatement    : null
    },
    
    
    methods : {
        
        setParent : function (parent) {
            if (this.parent) throw "Can't redefine 'parent' for [" + this + "]"
            
            this.parent = parent
            
            this.scope = this.scope || parent.scope
        },
        
        
        deriveChild : function () {
            return new this.constructor({
                parent : this
            })
        },

        
        entry : function () {
            this.statement.run(this)
        },
        
        
        canLeave : function () {
            return true
        },
        
        
        leave : function () {
            if (!this.canLeave()) return
            
            if (this.finallyStatement) {
                var child = this.deriveChild()
                
                child.statement = this.finallyStatement
                
                child.entry()
            }
        },
        
        
        CONTINUE : function () {
            this.leave.apply(this, arguments)
        }
    }
})