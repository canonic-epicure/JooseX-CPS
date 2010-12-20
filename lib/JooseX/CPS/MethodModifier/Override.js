Class('JooseX.CPS.MethodModifier.Override', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier.Override,
    
    use : 'JooseX.CPS.Continuation',
    
    
    methods : {
    
        prepareWrapper : function (params) {
            
            var overriden = this.SUPER(params)
            
            var continued = function () {
                
                if (this.__CNT__) {
                    var cont = this.__CNT__
                    
                    delete this.__CNT__
                } else
                    cont = Joose.top.__GLOBAL_CNT__ || new JooseX.CPS.Continuation()
                
                return cont.TRY(overriden, this, arguments)
            }
            
            continued.IS_CONTINUED = true
            
            return continued
        }
    }
})
