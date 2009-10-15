Class('JooseX.CPS.Continuation.TryRetThen', {
    
    
    has : {
        previous        : null,
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
            if (this.parent) 
                this.parent.unnest(this, value)
            else 
                this.previous.unnest(this, value)
        },
        
        
        THEN : function (thenFunc) {
            if (typeof thenFunc == 'function') {
                var next = this.next = this.then()
                
                var res = next.TRY(thenFunc)
                
                this.start()
                
                return res
            } else {
                var next = this.next = thenFunc
                next.previous = this
                
                this.start()
                
                return next
            }
            
        },
        
        
        NOW : function () {
            return this.THEN(new JooseX.CPS.Continuation.TryRetThen.Now())
        },
        
        
        start : function (result) {
            this.tryFunc(this.nest(), result)
        },
        
        
        nest : function () {
            return new this.constructor({
                parent : this
            })
        },
        
        
        unnest : function (nested, value) {
            if (nested == this.next) {
                if (this.previous)
                    this.previous.unnest(this, value)
                else
                    if (this.parent)
                        this.parent.unnest(this, value)
            } else
                this.next.start(value)
        },

        
        then : function () {
            return new this.constructor({
                previous : this
            })
        }
        
    },
    
    
    body : function () {
        
        Class('Now', {
            
            isa : JooseX.CPS.Continuation.TryRetThen,
            
            methods : {
                
                start : function (result) {
                    this.RETURN(result)
                }
            }
        })
        //eof Now
    }

})