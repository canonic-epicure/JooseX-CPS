Class('JooseX.CPS.MethodModifier.Override', {
    
    isa : Joose.Managed.Property.MethodModifier.Override,
    
    
    methods : {
    
        prepareWrapper : function (params) {
            
            var overriden = this.SUPER(params)
            
            var continued = function () {
                
                var args = Array.prototype.slice.call(arguments)
                
                if (args.length && args[0] instanceof JooseX.CPS.Continuation) 
                    var cont = new JooseX.CPS.Continuation({
                        parent : args.shift()
                    })
                else 
                    var cont = new JooseX.CPS.Continuation()
                    
                //note - 'cont' will be unshifted to args 
                return cont.TRY(overriden, this, args)
            }
            
//            continued.IS_CONTINUED = true
            
            return continued
        }
    }
})



////call to Joose.Proto level, require some additional processing
//        var isCallToProto = superProto.meta.constructor == Joose.Proto.Class || superProto.meta.constructor == Joose.Proto.Object
//        
//        var original = originalCall
//        
//        if (isCallToProto) original = function () {
//            var beforeSUPER = this.SUPER
//            
//            this.SUPER  = superProto.SUPER
//            
//            var res = originalCall.apply(this, arguments)
//            
//            this.SUPER = beforeSUPER
//            
//            return res
//        }
