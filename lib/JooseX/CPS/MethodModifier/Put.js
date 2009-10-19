Class('JooseX.CPS.MethodModifier.Put', {
    
    isa : 'JooseX.CPS.MethodModifier.Override',
    
    
    methods : {
        
        prepareWrapper : function (params) {
            
            if (params.isOwn) throw "Method [" + params.name + "] is applying over something [" + params.originalCall + "] in class [" + params.target + "]"
            
            return this.SUPER(params)
        }
    }
})