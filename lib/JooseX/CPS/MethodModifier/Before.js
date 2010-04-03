Class('JooseX.CPS.MethodModifier.Before', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier,
    
    use : 'JooseX.CPS.Statement',
    
    
    methods : {
        
        prepareWrapper : function (params) {
            
            var name            = params.name
            var modifier        = params.modifier
            var isOwn           = params.isOwn
            var original        = params.target.prototype[name]
            var superProto      = params.superProto
            var originalCall    = params.originalCall
            
            
            var then = function () {
                var isContinued     = isOwn ? original.IS_CONTINUED : superProto[name].IS_CONTINUED
                
                if (isContinued) 
                    originalCall.apply(this, arguments).NOW()
                else
                    this.CONTINUE(originalCall.apply(this, arguments))
            }
            
            
            var continued = function () {
                
                var cont = this.CONT || Joose.top.__GLOBAL_CNT__ || new JooseX.CPS.Statement()
                
                return cont.TRY(function () {
                    
                    this.CONT.TRY(modifier, this, arguments).NOW()
                    
                }, this, arguments).THEN(then, this, arguments)
            }
            
            continued.IS_CONTINUED = true
            
            return continued
        }
    }
})