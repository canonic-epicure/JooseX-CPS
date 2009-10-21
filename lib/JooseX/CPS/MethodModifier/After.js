Class('JooseX.CPS.MethodModifier.After', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier,
    
    use : 'JooseX.CPS.Continuation.TryRetThen',
    
    
    methods : {
        
        prepareWrapper : function (params) {
            
            var name            = params.name
            var modifier        = params.modifier
            var isOwn           = params.isOwn
            var original        = params.target.prototype[name]
            var superProto      = params.superProto
            var originalCall    = params.originalCall
            
            
            var source = function () {
                var isContinued     = isOwn ? original.IS_CONTINUED : superProto[name].IS_CONTINUED
                
                if (isContinued) 
                    originalCall.apply(this, arguments).NOW()
                else
                    this.RETURN(originalCall.apply(this, arguments))
            }
            
            
            var continued = function () {
                
                var cont = this.CONT && this.CONT.nest() || new JooseX.CPS.Continuation.TryRetThen()
                
                return cont.TRY(source, this, arguments).THEN(modifier, this, arguments)
            }
            
            continued.IS_CONTINUED = true
            
            return continued
        }
    }
})