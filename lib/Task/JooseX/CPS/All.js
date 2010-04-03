Class('JooseX.CPS.Statement', {
    
    has : {
        parent          : null,
        previous        : null,
        
        statements      : Joose.I.Array,
        
        entered         : false,
        leaved          : false,
        
        defaultScope    : null,
        
        nextFunc        : null,
        
        catchFunc       : null,
        catchScope      : null,
        
        finallyFunc     : null,
        finallyScope    : null
    },
    
    
    methods : {
        
        deriveChild : function (config) {
            config              = config || {}
            
            config.parent       = this
            
            return new this.constructor(config)
        },
        
        
        deriveSibling : function (config) {
            config              = config || {}
            
            config.parent       = this.parent
            config.previous     = this
            
            return new this.constructor(config)
        },
        
        
        getNextFunc : function () {
            return this.nextFunc || this.parent && this.parent.getNextFunc()
        },
        
        
        getScope    : function () {
            var prev    = this.previous || this.parent
            
            return this.defaultScope || prev && prev.getScope() || Joose.top
        },
        
        
        entry : function () {
            if (this.entered)   throw "Can't re-enter the continuation + [" + this + "]"
            
            this.entered    = true
            
            this.runCore.apply(this, arguments)
        },
        
        
        runCore : function () {
            var me          = this
            var statements  = this.statements
            
            if (statements.length) {
                var statement = statements.shift()
                
                var child = this.deriveChild({
                    defaultScope    : statement.scope,
                    
                    nextFunc        : function () {
                        me.runCore.apply(me, arguments)
                    }
                })
                
                this.run(statement.func, statement.scope, statement.args || arguments, child)
                
            } else
                this.leave.apply(this, arguments)
        },
        
        
        run : function (func, scope, args, statement) {
            var glob                = Joose.top
            var previousStatement   = glob.__GLOBAL_CNT__

            glob.__GLOBAL_CNT__ = scope.CONT = statement
            
            try {
                if (func.apply(scope, args) !== undefined) throw "ERROR: Value returned from continued function (use `CONTINUE(value)` instead)" 
            } catch (e) {
                statement.THROW(e)
            } finally {
                glob.__GLOBAL_CNT__ = scope.CONT = previousStatement
            }
        },
        

        
        leave : function () {
            var args            = arguments
            
            var finallyFunc     = this.finallyFunc
            
            
            if (finallyFunc) {
                delete this.finallyFunc
                
                var finallyScope     = this.finallyScope
                var me               = this
                
                var finallyStatement = this.deriveChild({
                    defaultScope    : finallyScope,
                    
                    nextFunc        : function () {
                        me.leave.apply(me, args)
                    }
                })
                
                this.run(finallyFunc, finallyScope, [], finallyStatement)
                
                return
            }
            
            
            if (this.leaved)   throw "Can't re-leave the continuation + [" + this + "]"

            this.leaved         = true
            
            var nextFunc        = this.getNextFunc()
            if (nextFunc) nextFunc.apply(Joose.top, args)
        },
        
        
        THROW : function (exception) {
            var args        = arguments
            
            var catchFunc   = this.catchFunc
            
            if (catchFunc) {
                delete this.catchFunc
                
                var catchScope      = this.catchScope
                var me              = this
                
                var catchStatement = this.deriveChild({
                    defaultScope    : catchScope,
                    
                    nextFunc        : function () {
                        me.leave.apply(me, arguments)
                    }
                })
                
                this.run(catchFunc, catchScope, args, catchStatement)

                return
            } 
            
            var parent      = this.parent
            
            if (parent) {
                this.nextFunc = function () {
                    parent.THROW.apply(parent, args)
                }
                
                this.leave()
                
                return
            } 
            
            throw exception
        },
        
        
        CONTINUE : function () {
            return this.leave.apply(this, arguments)
        },
        
        
        RETURN : function () {
            if (this.parent) this.nextFunc = this.parent.getNextFunc()
            
            return this.leave.apply(this, arguments)
        },
        
        
        TRY : function (func, scope, args) {
            if (this.leaved)            throw "Can't call 'TRY' for [" + this + "] - its already leaved"
            if (!func)                  throw "Invalid parameters for 'TRY' in [" + this + "]"
            
            if (this.catchFunc || this.finallyFunc) return this.NEXT.apply(this, arguments)
            
            this.statements.push({
                func    : func,
                scope   : scope || this.getScope(),
                args    : args
            })
            
            this.defaultScope = scope || this.defaultScope
                
            return this
        },
        
        
        THEN : function () {
            return this.TRY.apply(this, arguments)
        },
        
        
        CATCH : function (func, scope) {
            if (this.leaved)            throw "Can't call 'CATCH' for [" + this + "] - its already leaved"
            if (!func)                  throw "Invalid parameters for 'CATCH' in [" + this + "]"
            if (this.catchFunc)         throw "Can't redefine 'CATCH' for [" + this + "]"
            
            this.catchFunc      = func
            this.catchScope     = scope || this.getScope()
            
            return this 
        },
        
        
        FINALLY : function (func, scope) {
            if (this.leaved)            throw "Can't call 'FINALLY' for [" + this + "] - its already leaved"
            if (!func)                  throw "Invalid parameters for 'FINALLY' in [" + this + "]"
            if (this.finallyFunc)       throw "Can't redefine 'FINALLY' for [" + this + "]"
            
            this.finallyFunc      = func
            this.finallyScope     = scope || this.getScope()
            
            return this
        },
        
        
        
        NEXT : function (func, scope, args) {
            if (this.leaved)            throw "Can't call 'NEXT' for [" + this + "] - its already leaved"
            
            var next = this.deriveSibling()
            
            this.nextFunc = function () {
                next.entry.apply(next, arguments)
            }
            
            return next.TRY(func, scope, args)
        },
        
        
        NOW : function () {
            var root = this.getNearestNotEntered()
            
            if (!root)                  throw "Can't launch  [" + this + "]"
            
            root.entry.apply(root, arguments)
        },
        
        
        getNearestNotEntered : function () {
            if (this.entered) return null
            
            var prev = this.previous || this.parent 
            
            if (prev) {
                var root = prev.getNearestNotEntered()
                
                if (root) return root
            }
            
            return this
        },
        
        
        // Delegates
        getCONTINUE : function () {
            var me = this
            
            return function () {
                me.CONTINUE.apply(me, arguments)
            }
        },
        
        
        getRETURN : function () {
            var me = this
            
            return function () {
                me.RETURN.apply(me, arguments)
            }
        },
        
        
        getTHROW : function () {
            var me = this
            
            return function () {
                me.THROW.apply(me, arguments)
            }
        },
        
        
        // Synonyms
        then : function () {
            return this.THEN.apply(this, arguments)
        },
        
        
        next : function () {
            return this.NEXT.apply(this, arguments)
        },
        
        
        now : function () {
            return this.NOW.apply(this, arguments)
        },

        
        except : function () {
            return this.CATCH.apply(this, arguments)
        },
        
        
        ensure : function () {
            return this.FINALLY.apply(this, arguments)
        }
        
    }
    //eof methods
})


TRY = function () {
    var statement = new JooseX.CPS.Statement()
    
    return statement.TRY.apply(statement, arguments)
};
Class('JooseX.CPS.MethodModifier.Override', {
    
    meta : Joose.Meta.Class,
    
    isa : Joose.Managed.Property.MethodModifier.Override,
    
    use : 'JooseX.CPS.Statement',
    
    
    methods : {
    
        prepareWrapper : function (params) {
            
            var overriden = this.SUPER(params)
            
            var continued = function () {
                
                var cont = this.CONT || Joose.top.__GLOBAL_CNT__ || new JooseX.CPS.Statement()
                
                return cont.TRY(overriden, this, arguments)
            }
            
            continued.IS_CONTINUED = true
            
            return continued
        }
    }
});
Class('JooseX.CPS.MethodModifier.After', {
    
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
            
            
            var continuedOriginal = function () {
                var isContinued     = isOwn ? original.IS_CONTINUED : superProto[name].IS_CONTINUED
                
                if (isContinued) 
                    originalCall.apply(this, arguments).NOW()
                else
                    this.CONTINUE(originalCall.apply(this, arguments))
            }
            
            
            var continued = function () {
                
                var cont = this.CONT || Joose.top.__GLOBAL_CNT__ || new JooseX.CPS.Statement()
                
                var args = arguments
                
                return cont.TRY(continuedOriginal, this, arguments).THEN(function () {
                    
                    var res = arguments
                    
                    this.CONT.TRY(modifier, this, args).THEN(function () {
                        
                        this.CONTINUE.apply(this, res)
                    }).NOW()
                    
                }, this)
            }
            
            continued.IS_CONTINUED = true
            
            return continued
        }
    }
});
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
});
Class('JooseX.CPS.MethodModifier.Put', {
    
    isa : 'JooseX.CPS.MethodModifier.Override',
    
    
    methods : {
        
        prepareWrapper : function (params) {
            
            if (params.isOwn) throw "Method [" + params.name + "] is applying over something [" + params.originalCall + "] in class [" + params.target + "]"
            
            return this.SUPER(params)
        }
    }
});
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
            }, this)
        },
        
        
        before : function (meta, info) {
            Joose.O.each(info, function (value, name) {
                meta.addMethodModifier(name, value, JooseX.CPS.MethodModifier.Before)
            }, this)
        },
        
        
        override : function (meta, info) {
            Joose.O.each(info, function (value, name) {
                meta.addMethodModifier(name, value, JooseX.CPS.MethodModifier.Override)
            }, this)
        },
        
        
        have : function () {
            throw "'have' builder is not supported in the 'continued' section"
        },
        
        
        havenot : function () {
            throw "'havenot' builder is not supported in the 'continued' section"
        },
        
    
        around : function () {
            throw "'around' builder is not supported in the 'continued' section"
        },
        
        
        augment : function () {
            throw "'augment' builder is not supported in the 'continued' section"
        },
        
        
        does : function () {
            throw "'does' builder is not supported in the 'continued' section"
        },
        
    
        doesnot : function () {
            throw "'doesnot' builder is not supported in the 'continued' section"
        }
    }
})

;
Role('JooseX.CPS.ControlFlow', {
    
    use : [ 'JooseX.CPS.Statement' ],
    
    has : {
        CONT            : null,
        RESULT          : null,
        RESULTS         : null
    },
    
    
    methods : {
        
        TRY : function (func, scope, args) {
            var cont = this.CONT
            
            scope = scope || this
            
            return cont.TRY.call(cont, func, scope, args)
        },
        
        
        THEN : function (func, scope, args) {
            var cont = this.CONT
            
            scope = scope || this
            
            return cont.THEN.call(cont, func, scope, args)
        },
        
        
        NEXT : function (func, scope, args) {
            var cont = this.CONT
            
            scope = scope || this
            
            return cont.NEXT.call(cont, func, scope, args)
        },
        
        
        NOW : function () {
            this.CONT.NOW()
        },
        
        
        CONTINUE : function () {
            var cont = this.CONT
            
            cont.CONTINUE.apply(cont, arguments)
        },
        
        
        RETURN : function () {
            var cont = this.CONT
            
            cont.RETURN.apply(cont, arguments)
        },
        
        
        THROW : function (exception) {
            var cont = this.CONT
            
            cont.THROW.apply(cont, arguments)
        },
        
        
        getCONTINUE : function () {
            return this.CONT.getCONTINUE()
        },
        
        
        getRETURN : function () {
            return this.CONT.getRETURN()
        },
        
        
        getTHROW : function () {
            return this.CONT.getTHROW()
        },
        
        
        detachScope : function () {
            this.CONT = new JooseX.CPS.Statement()
            
            return this
        }
        
    }
    //eof methods

});
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


/**

Name
====


JooseX.CPS - Some syntax sugar, enabling the [Continuation Passing Style](http://en.wikipedia.org/wiki/Continuation-passing_style) for Joose methods


SYNOPSIS
========

        Class("DataStore", {
        
            trait : JooseX.CPS,
        
            has: {
                data    : { is: "rw" }
            },
            
            continued : {
            
                methods : {
                
                    save : function (url) {
                    
                        XHR.request({
                            url      : url,
                            data     : this.data,
                        
                            callback : this.getCONTINUE(),
                            errback  : this.getTHROW()
                        })
                    }
                }
            }
        })
        
        var store = new DataStore({
            data : [ 1, 2, 3]
        })
        
        UI.maskScreen("Please wait")
        
        store.save('http://remote.site.com/webservice').THEN(function (response) {
            
            if (response.isOk) {           
                alert('Saved correctly')
                
                this.CONTINUE()
            } else
                this.THROW('still got the error')
            
        }).CATCH(function (e) {
        
            alert('Error during saving: ' + e)
            
            this.CONTINUE()
            
        }).FINALLY(function () {
        
            UI.removeScreenMask()
        })


DESCRIPTION
===========

`JooseX.CPS` is a trait for metaclasses, which enables "Continuation passing style" in Joose methods and method modifiers.

`JooseX.CPS` allows you to define special "continued" methods and method modifiers, which forms the *asynchronous interface* of the class, 
but behave just like ordinary methods in other aspects (can be inherited, composed from Role, etc).


`continued` BUILDER
===================

Adding `JooseX.CPS` trait will provide your class with the `continued` builder. This builder groups the declaration of the "asynchrounous part" of your class.
Inside it, you can use the following builders: `methods`, `override`, `after`, `before`. This builders have the same meaning as standard ones, however instead of usual, 
they defines the "continued" methods.


"Continued" methods
-------------------

"Continued" methods are methods which do not transfer the control flow with the standard `return` statement. Instead, to transfer the control flow from such method you need to call the
`CONTINUE` (or `RETURN`, or `THROW`) method in the current scope:


        Class("DataStore", {
        
            continued : {
            
                methods : {
                
                    save : function (url) {
                        if (!url.test(/^http/) { this.THROW("Invalid URL"); return }
                        
                        ...
                        
                        this.CONTINUE(result)
                    }
                }
            }
        })
        
The call to such method don't have to be synchronous - this naturally allows to use them as callbacks (or errbacks).

The `CONTINUE`, `RETURN` or `THROW` methods in the current scope are called "control flow" methods. 

Continued methods have the following features:

- They are executed strictly asynchronously (with `setTimeout(func, 0)`). You *cannot* rely that any of such method will be executed synchronously.

- You cannot return the value from it, in the usual meaning (with `return`). Any returned value will cause an error.

- Inside of each method, in the current scope, is available the special *continuation instance*: `this.CONT`
 
 Its an instance of [JooseX.CPS.Statement][JooseX.CPS.Statement]. All the "control flow" methods are actually executed as methods of this instance. 
 See the [JooseX.CPS.ControlFlow][JooseX.CPS.ControlFlow] for details.
    
- The parameters for any control flow method will became the arguments for the following scope. 


"Continued" method modifiers
----------------------------


EXAMPLES
========


GETTING HELP
============

This extension is supported via github issues tracker: [http://github.com/SamuraiJack/JooseX-CPS/issues](http://github.com/SamuraiJack/JooseX-CPS/issues)

For general Joose questions you can also visit #joose on irc.freenode.org. 


SEE ALSO
========

[http://github.com/SamuraiJack/JooseX-CPS/](http://github.com/SamuraiJack/JooseX-CPS/)

Web page of this extensions

[http://joose.github.com/Joose/doc/html/Joose.html](http://joose.github.com/Joose/doc/html/Joose.html)

General documentation for Joose


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at [http://github.com/SamuraiJack/JooseX-CPS/issues](http://github.com/SamuraiJack/JooseX-CPS/issues)



AUTHORS
=======

Nickolay Platonov [nplatonov@cpan.org](mailto:nplatonov@cpan.org)



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 

[JooseX.CPS.Statement]: CPS/Continuation.html
[JooseX.CPS.ControlFlow]: CPS/ControlFlow.html

*/
;
