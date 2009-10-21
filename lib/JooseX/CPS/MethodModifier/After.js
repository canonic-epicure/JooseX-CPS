Class('JooseX.CPS.MethodModifier.After', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier,
    
    use : 'JooseX.CPS.Continuation.TryRetThen',
    
    
    methods : {
        
        prepareWrapper : function (params) {
            
            var modifier        = params.modifier
            var originalCall    = params.originalCall

            var continued = function () {
                
                var cont = this.CONT && this.CONT.nest() || new JooseX.CPS.Continuation.TryRetThen()
                
                return cont.TRY(originalCall, this, arguments).THEN(modifier, this, arguments)
            }
            
            continued.IS_CONTINUED = true
            
            return continued
        }
    }
})