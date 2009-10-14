Class('JooseX.CPS.Scope', {
    
    
    has : {
        parentScope       : null,          
        
        scopedTo          : null,
        
        returnTo          : null,
        
        catchTo           : null,
        
        variables         : Joose.Object
    }
    
})