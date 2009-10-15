Class('JooseX.CPS.Continuation.Now', {
    
    isa : 'JooseX.CPS.Continuation.TryRetThen',
    
    
    methods : {
        
        start : function (result) {
            this.RETURN(result)
        }
        
    }

})