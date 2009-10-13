Role('JooseX.CPS', {
    
    use : 'JooseX.CPS.Builder', 

    
    has : {
        continuedBuilder : null
    },
    
    
    after : {
        
        processStem : function () {
            this.continuedBuilder = new JooseX.CPS.Builder({ targetMeta : this })
        }
    },
    
    
    builder : {
        
        methods : {
            
            continued : function (meta, info) {
                this.continuedBuilder._extend(info)
            }
        }
        
    }

})