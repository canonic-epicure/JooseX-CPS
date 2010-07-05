COMPONENTS = {
    
    "Standalone" : [
        "JooseX.CPS.Continuation"
    ],
    
    
    "All" : [
        "+Standalone",
        
        "JooseX.CPS.MethodModifier.Override",
        "JooseX.CPS.MethodModifier.After",
        "JooseX.CPS.MethodModifier.Before",
        "JooseX.CPS.MethodModifier.Put",
        
        "JooseX.CPS.Builder",
        "JooseX.CPS.ControlFlow",
        "JooseX.CPS"
    ],
    
    
    "WebTest" : [
        "jsan:Task.Joose.Core",
        "jsan:JooseX.SimpleRequest",
        "jsan:Task.JooseX.Namespace.Depended.Web",
        "+All"
    ],
    
    
    "NodeJSTest" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Namespace.Depended.NodeJS",
        "+All"
    ]
} 

