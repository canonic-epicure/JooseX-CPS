Class('JooseX.CPS.Continuation', {
    
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
                
                // if statement is already leaved, then we are just propagating the exception from the further statements
                if (statement.leaved) throw e
                
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
        
        
        andTHEN : function () {
            return this.THEN.apply(this, arguments).now()
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
        
        
        andThen : function () {
            return this.andTHEN.apply(this, arguments)
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
    var continuation = new JooseX.CPS.Continuation()
    
    return continuation.TRY.apply(continuation, arguments)
}


/**

Name
====


JooseX.CPS.Continuation - A continuation class


SYNOPSIS
========

        TRY = function () {
            var continuation = new JooseX.CPS.Continuation()
            
            return continuation.TRY.apply(continuation, arguments)
        }


DESCRIPTION
===========

`JooseX.CPS.Continuation` implements a continuation - an underlaying basis for `JooseX.CPS` trait.


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

### parent

> `JooseX.CPS.Continuation parent`

> A parent for this continuation. Can be asked for default scope or for the [nextFunc]


### previous

> `JooseX.CPS.Continuation previous`

> A previous continuation for this continuation. Can be asked for default scope or for the [nextFunc]


### statements

> `Array statements`

> An array of statements. Each statement is an object like : 
    
            {
                func    : ... , // function to execute
                scope   : ... , // scope into which execute the function
                args    : ...   // arguments for function 
            }


### type

> `String type`

> The type of this continuation. Can be 'Sequential' or 'Parallel's


### entered

> `Boolean entered`

> The sign whether this continuation was already entered - i.e. activated.


### leaved

> `Boolean leaved`

> The sign whether this continuation was already leaved - i.e. the `CONTINUE` or `THROW` method were called.


### defaultScope

> `Object defaultScope`

> The default scope which will be supplied to the statements if not provided explicitly. Once passed to `TRY`, propagates to the further statements. 


### nextFunc

> `Function nextFunc`

> If present, this function will be called, when leaving this continuation. Will be called in the global scope, with the arguments from the method, initated the leave. 


### catchFunc/finallyFunc

> `Function catchFunc/finallyFunc`

> The functions for `CATCH/FINALLY` statements accordingly. 


### catchScope/finallyScope

> `Object catchScope/finallyScope`

> The scopes for `CATCH/FINALLY` statements accordingly.



METHODS
=======

### TRY

> `JooseX.CPS.Continuation TRY(Function func, Object scope?, Array args?)`

> Add a statement to the current continuation. If continuation already contains `CATCH` or `FINALLY` statements - then delegate to `NEXT` and return a next continuation instance.
otherwise return current continuation.


### THEN

> `JooseX.CPS.Continuation THEN(Function func, Object scope?, Array args?)`

> Alias for `TRY` with a single exception. If the type of the continuation is `Parallel` then delegate to `NEXT` and return a next continuation instance.

> Has a lower-case synonym : 'then'


### CATCH

> `JooseX.CPS.Continuation CATCH(Function func, Object scope?)`

> Add a `CATCH` statement to the current continuation. 

> Has a lower-case synonym : 'except'


### FINALLY

> `JooseX.CPS.Continuation FINALLY(Function func, Object scope?)`

> Add a `FINALLY` statement to the current continuation. 

> Has a lower-case synonym : 'ensure'


### NEXT

> `JooseX.CPS.Continuation NEXT(Function func, Object scope?, Array args?)`

> Derive a sibling continuation, chaining it after itself. Return newly created continuation.

> Has a lower-case synonym : 'next'


### AND

> `JooseX.CPS.Continuation AND(Function func, Object scope?, Array args?)`

> Alias for `TRY` that also switch a type of the continuation to `Parallel`.

> Has a lower-case synonym : 'and'


### NOW

> `JooseX.CPS.Continuation NOW()`

> Activates current continuation graph by looking the 1st not yet entered continuation. After finding it, delegate to its `entry` method with the passed arguments.

> Has a lower-case synonym : 'now'


### getCONTINUE

> `Function getCONTINUE()`

> Return a function, binded to the `CONTINUE` method of itself.


### getRETURN

> `Function getRETURN()`

> Return a function, binded to the `RETURN` method of itself.


### getTHROW

> `Function getTHROW()`

> Return a function, binded to the `THROW` method of itself.


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
