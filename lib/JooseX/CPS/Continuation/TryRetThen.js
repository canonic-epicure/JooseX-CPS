Class('JooseX.CPS.Continuation.TryRetThen', {
    
    
    has : {
        next            : null,
        parent          : null,
        
        tryFunc         : null
    },
    
    
    
    methods : {
        
        TRY : function (tryFunc) {
            this.tryFunc = tryFunc
                
            return this
        },
        
        
        RETURN : function (value) {
            if (this.parent) this.parent.unnest(this, value)
        },
        
        
        THEN : function (thenFunc) {
            if (typeof thenFunc == 'function') {
                var next = this.nest()
                
                next.TRY(thenFunc)
            } else {
                var next = thenFunc
                next.parent = this
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
            this.tryFunc.call(this, this.nest(), result)
        },
        
        
        nest : function () {
            return new this.constructor({
                parent : this
            })
        },
        
        
        unnest : function (nested, value) {
            if (nested == this.next || !this.next) {
                this.RETURN(value)
            } else
                this.sync(nested, value)
        },
        
        
        sync : function (returned, value) {
            this.next.start(value)
        }
        
    }

})