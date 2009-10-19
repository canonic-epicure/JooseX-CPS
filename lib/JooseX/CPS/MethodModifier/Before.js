Class('JooseX.CPS.MethodModifier.Before', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier,
    
    
    methods : {
        
        prepareWrapper : function (name, modifier, originalCall, superProto) {
            
            return function () {
                modifier.apply(this, arguments)
                return originalCall.apply(this, arguments)
            }
        }
    }
})