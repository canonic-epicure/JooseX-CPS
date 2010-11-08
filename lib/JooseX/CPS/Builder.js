Class('JooseX.CPS.Builder', {
    
    meta : Joose.Meta.Class,
    
    use : [
        'JooseX.CPS.MethodModifier.Put',
        'JooseX.CPS.MethodModifier.After',
        'JooseX.CPS.MethodModifier.Before',
        'JooseX.CPS.MethodModifier.Override'
    ],
    
    isa : Joose.Managed.Builder,
    
    
    methods : {
        
        methods : function (meta, info) {
            var methods = meta.stem.properties.methods
            
            Joose.O.eachOwn(info, function (value, name) {
                methods.addProperty(name, {
                    meta : JooseX.CPS.MethodModifier.Put,
                    init : value
                })
            })
        },
        
    
        after : function (meta, info) {
            Joose.O.each(info, function (value, name) {
                
                meta.addMethodModifier(name, value, JooseX.CPS.MethodModifier.After)
            })
        },
        
        
        before : function (meta, info) {
            Joose.O.each(info, function (value, name) {
                
                meta.addMethodModifier(name, value, JooseX.CPS.MethodModifier.Before)
            })
        },
        
        
        override : function (meta, info) {
            Joose.O.each(info, function (value, name) {
                
                meta.addMethodModifier(name, value, JooseX.CPS.MethodModifier.Override)
            })
        }
    }
})

