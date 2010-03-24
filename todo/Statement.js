Class('JooseX.CPS.Statement', {
    
    has : {
        func            : null,
        scope           : null,
        args            : null
    },
    
    
    methods : {
        
        run : function (context) {
            
            
            this.func.apply(this.scope, this.args)
        }
        
    }
})