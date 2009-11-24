Class('JooseX.CPS.MethodModifier.After', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier,
    
    use : 'JooseX.CPS.Continuation',
    
    
    methods : {
        
        prepareWrapper : function (params) {
            
            var name            = params.name
            var modifier        = params.modifier
            var isOwn           = params.isOwn
            var original        = params.target.prototype[name]
            var superProto      = params.superProto
            var originalCall    = params.originalCall
            
            
            var continuedOriginal = function () {
                var isContinued     = isOwn ? original.IS_CONTINUED : superProto[name].IS_CONTINUED
                
                if (isContinued) 
                    originalCall.apply(this, arguments).NOW()
                else
                    this.CONTINUE(originalCall.apply(this, arguments))
            }
            
            
            var continued = function () {
                
                var cont = this.CONT || JooseX.CPS.Continuation.my.CONT || new JooseX.CPS.Continuation()
                
                return cont.TRY(continuedOriginal, this, arguments).THEN(function () {
                    
                    var res = this.RESULTS
                    
                    this.CONT.TRY(modifier, this, arguments).THEN(function () {
                        
                        this.CONTINUE.apply(this, res)
                    }).NOW()
                    
                }, this, arguments)
            }
            
            continued.IS_CONTINUED = true
            
            return continued
        }
    }
})