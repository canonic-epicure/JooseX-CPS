Role('JooseX.CPS', {
    
    use : [ 'JooseX.CPS.Builder', 'JooseX.CPS.ControlFlow' ], 

    
    has : {
        continuedBuilder : null
    },
    
    
    after : {
        
        processStem : function () {
            this.continuedBuilder = new JooseX.CPS.Builder({ targetMeta : this })
            
            this.addRole(JooseX.CPS.ControlFlow)
        }
    },
    
    
    builder : {
        
        methods : {
            
            continued : function (meta, info) {
                
                meta.continuedBuilder._extend(info)
            }
        }
    }
})
