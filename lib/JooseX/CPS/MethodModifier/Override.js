Class('JooseX.CPS.MethodModifier.Override', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier.Override,
    
    use : 'JooseX.CPS.Statement',
    
    
    methods : {
    
        prepareWrapper : function (params) {
            
            var overriden = this.SUPER(params)
            
            var continued = function () {
                
                var cont = this.CONT || Joose.top.__GLOBAL_CNT__ || new JooseX.CPS.Statement()
                
                return cont.TRY(overriden, this, arguments)
            }
            
            continued.IS_CONTINUED = true
            
            return continued
        }
    }
})