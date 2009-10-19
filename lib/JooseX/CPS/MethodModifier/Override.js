Class('JooseX.CPS.MethodModifier.Override', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier.Override,
    
    use : 'JooseX.CPS.Continuation.TryRetThen',
    
    
    methods : {
    
        prepareWrapper : function (params) {
            
            var overriden = this.SUPER(params)
            
            var continued = function () {
                
                var cont = new JooseX.CPS.Continuation.TryRetThen()
                
                return cont.TRY(overriden, this, arguments)
            }
            
//            continued.IS_CONTINUED = true
            
            return continued
        }
    }
})