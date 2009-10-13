Class('JooseX.CPS.Continuation', {
    
    
    has : {
        scope                   : null,
        
        onThen                  : null,
        
        
        nativeScope             : null,
        
        resumeFromFunc          : null,
        resumeFromScope         : null,
        resumeArgs              : null
    },
    
    
    
    
    methods : {
        
        TRY : function () {
        },
        
        
        CATCH : function () {
        },
        
        
        THROW : function () {
        },
        
        
        THEN : function () {
        },
        
        
        RETURN : function () {
        },
        
        
        then : function () {
            return this.THEN.apply(this, arguments)
        },
        
        
        now : function () {
            return this.TRY.apply(this, arguments)
        },
        

        except : function () {
            return this.CATCH.apply(this, arguments)
        }
        
        
//        resumeFrom : function (func, scope, args) {
//            this.resumeFromFunc = func
//            this.resumeFromScope = scope || this.nativeScope
//            this.resumeArgs = args
//        },
//        
//        
//        then : function (callback, scope) {
//            this.callback = callback
//            this.scope = scope || this.nativeScope
//            
//            this.now()
//        },
//        
//        
//        now : function () {
//            var resumeFromFunc = this.resumeFromFunc
//            
//            if (!resumeFromFunc) throw "Continuation used without resume point"
//            
//            resumeFromFunc.apply(this.resumeFromScope, this.resumeArgs || [])
//        },
//        
//        
//        done : function () {
//            var callback = this.callback
//            if (callback) callback.apply(this.scope || this.nativeScope, arguments)
//        }
        
    }

})