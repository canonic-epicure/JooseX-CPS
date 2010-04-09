Class('JooseX.CPS.Statement', {
    
    has : {
        parent          : null,
        previous        : null,
        
        statements      : Joose.I.Array,
        type            : 'Sequential',
        
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
            
            this[ 'runCore' + this.type ].apply(this, arguments)
        },
        
        
        runCoreSequential : function () {
            var me          = this
            var statements  = this.statements
            
            if (statements.length) {
                var statement = statements.shift()
                
                var child = this.deriveChild({
                    defaultScope    : statement.scope,
                    
                    nextFunc        : function () {
                        me.runCoreSequential.apply(me, arguments)
                    }
                })
                
                this.run(statement.func, statement.scope, statement.args || arguments, child)
                
            } else
                this.leave.apply(this, arguments)
        },
        
        
        runCoreParallel : function () {
            var args        = arguments
            
            var statements  = this.statements
            var length      = statements.length
            var me          = this
            
            var results     = []
            var counter     = 0
            
            Joose.A.each(statements, function (statement, index) {
                
                me.deriveChild().TRY(statement.func, statement.scope, statement.args || args).THEN(function () {
                    counter++
                    results[index] = arguments
                    
                    this.CONT.CONTINUE()
                }).CATCH(function () {
                    counter++
                    results[index] = arguments
                    
                    this.CONT.CONTINUE()
                }).FINALLY(function () {
                        
                    if (counter == length) me.leave(results)
                }).NOW()
            })
        },
        
        
        
        run : function (func, scope, args, statement) {
            var glob                = Joose.top
            var prevScopeStatement  = scope.CONT
            var prevGlobStatement   = glob.__GLOBAL_CNT__

            glob.__GLOBAL_CNT__ = scope.CONT = statement
            
            try {
                if (func.apply(scope, args) !== undefined) throw "ERROR: Value returned from continued function (use `CONTINUE(value)` instead)" 
            } catch (e) {
                statement.THROW(e)
            } finally {
                scope.CONT              = prevScopeStatement
                glob.__GLOBAL_CNT__     = prevGlobStatement
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
            if (this.type == 'Parallel') return this.NEXT.apply(this, arguments)
            
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
        
        
        AND : function () {
            this.type = 'Parallel'
            
            return this.TRY.apply(this, arguments)
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
        and : function () {
            return this.AND.apply(this, arguments)
        },
        
        
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
}


/**

Name
====


JooseX.CPS.Statement - A continuation class


SYNOPSIS
========

        TRY = function () {
            var statement = new JooseX.CPS.Statement()
            
            return statement.TRY.apply(statement, arguments)
        }


DESCRIPTION
===========

`JooseX.CPS.Statement` implements a continuation - an underlaying basis for `JooseX.CPS` trait.


ISA
===

None.


DOES
====

None.


TRAITS
======

None.


ATTRIBUTES
==========

### attributeName

> `AttributeType attributeName`

> Attribute description


METHODS
=======

### methodName

> `method signature`

> Method description



GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/JooseX-CPS/issues>

For general Joose questions you can also visit the [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1) on irc.freenode.org, or the forum at <http://joose.it/forum>



SEE ALSO
========

[Main documentation page](../CPS.html)

General documentation for Joose: <http://openjsan.org/go/?l=Joose>



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


*/
