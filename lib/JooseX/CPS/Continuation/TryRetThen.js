Class('JooseX.CPS.Continuation.TryRetThen', {
    
    
    has : {
        next            : null,
        parent          : { is : 'rw' },
        
        tryFunc         : null,
        tryScope        : null,
        tryArgs         : null
    },
    
    
    
    methods : {
        
        setParent : function (parent) {
            if (this.parent) throw "Can't redefine 'parent' for [" + this + "]"
            
            this.parent = parent
            
            this.tryScope = parent.tryScope
        },
        
        
        setTry : function (tryFunc, tryScope, tryArgs) {
            if (!tryFunc) throw "Wrong parameters for 'TRY' in [" + this + "]"
            if (this.tryFunc) throw "Can't redefine 'TRY' for [" + this + "]" 
            
            this.tryFunc        = tryFunc
            this.tryScope       = tryScope || this.tryScope || this
            this.tryArgs        = tryArgs || []
        },
        
        
        TRY : function (tryFunc, tryScope, tryArgs) {
            this.setTry(tryFunc, tryScope, tryArgs)
                
            return this
        },
        
        
        RETURN : function (value) {
            if (this.parent) this.parent.unnest(this, value)
        },
        
        
        THEN : function (thenFunc, thenScope) {
            if (typeof thenFunc == 'function') {
                var next = this.nest()
                
                next.TRY(thenFunc)
            } else {
                var next = thenFunc
                next.setParent(this)
            }
            
            this.next = next
            
            this.start()
            
            return next
        },
        
        
        NOW : function () {
            return this.THEN(function (cn, result) {
                cn.RETURN(result)
            })
        },
        
        
        start : function (result) {
            this.tryFunc.call(this.tryScope, this.nest(), result)
        },
        
        
        nest : function () {
            return new this.constructor({
                parent : this
            })
        },
        
        
        unnest : function (returned, value) {
            if (returned == this.next || !this.next) {
                delete this.next
                this.RETURN(value)
            } else
                this.sync(returned, value)
        },
        
        
        sync : function (returned, value) {
            this.next.start(value)
        }
        
    }

})