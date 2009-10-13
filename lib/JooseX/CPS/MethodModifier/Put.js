JooseX.CPS.MethodModifier.Put = new Joose.Proto.Class('JooseX.CPS.MethodModifier.Put', {
    
    isa : JooseX.CPS.MethodModifier.Override,


    prepareWrapper : function (name, modifier, originalCall, superProto) {
        
//        if (isOwn) throw "Method [" + name + "] is applying over something [" + original + "] in class [" + target + "]"
        return JooseX.CPS.MethodModifier.Put.superClass.prepareWrapper.apply(this, arguments)
    }
    
    
}).c