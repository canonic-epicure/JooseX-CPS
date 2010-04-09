Name
====


JooseX.CPS - Implementation of the Continuation Passing Style<sup>[1](http://en.wikipedia.org/wiki/Continuation-passing_style)</sup> 
for JavaScript, plus some syntax sugar, simplifying its usage in Joose methods and method modifiers


SYNOPSIS
========

Stand-alone usage:

        UI.maskScreen("Please wait")
        
        TRY(function (url, data) {
                    
            XHR.request({
                url      : url,
                data     : 'data',
            
                callback : this.CONT.getCONTINUE(),
                errback  : this.CONT.getTHROW()
            })
            
        }).THEN(function (response) {
            
            if (response.isOk) {           
                alert('Saved correctly')
                
                this.CONT.CONTINUE()
            } else
                throw 'still got the error' // or: this.CONT.THROW('still got the error') 
            
        }).CATCH(function (e) {
        
            alert('Error during saving: ' + e)
            
            this.CONT.CONTINUE()
            
        }).FINALLY(function () {
        
            UI.removeScreenMask()
            
        }).NOW('http://remote.site.com/webservice', 'some data')
        
        
The same in OOP:        
        
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
                            data     : this.getData(),
                        
                            callback : this.getCONTINUE(),
                            errback  : this.getTHROW()
                        })
                    }
                }
            }
        })
        
        var store = new DataStore({
            data : [ 1, 2, 3 ]
        })
        
        UI.maskScreen("Please wait")
        
        store.save('http://remote.site.com/webservice').THEN(function (response) {
            
            if (response.isOk) {           
                alert('Saved correctly')
                
                this.CONTINUE()
            } else
                throw 'still got the error' // or: this.CONT.THROW('still got the error') 
            
        }).CATCH(function (e) {
        
            alert('Error during saving: ' + e)
            
            this.CONTINUE()
            
        }).FINALLY(function () {
        
            UI.removeScreenMask()
        }).NOW()


DESCRIPTION
===========

`JooseX.CPS` is a trait for meta-classes, which enables "Continuation passing style" in Joose methods and method modifiers.

`JooseX.CPS` allows you to define special "continued" methods and method modifiers, which forms the *asynchronous interface* of your class, 
and behave just like ordinary methods - can be inherited, composed from Role, etc.


STANDALONE USAGE
================

This module can be used on its own, completely separately from Joose. For this mode, include only the `lib/Task/JooseX/CPS/Standalone.js` file in your deployment.
This file will export `TRY` function:

### TRY

> `JooseX.CPS.Continuation TRY(Function func, Object scope?, Array args?)`

> Create and setup an anonymous [JooseX.CPS.Continuation] instance. 

For the complete list of the available methods please refer to the link, in the meantime, take a look on the example below to see the main idea:

        TRY(function () {
        
            var CONT = this.CONT
            
            XHR.request({
                url      : url,
                data     : this.data,
            
                callback : this.CONT.getCONTINUE(),
                
                errback  : function (err1, err2) {
                    CONT.THROW(err1, err2) 
                }
            })
            
        }).CATCH(function (e1, e2) {
        
            ...
            
            this.CONT.CONTINUE()
        
        }).FINALLY(function () {
            
            ...
            
            this.CONT.CONTINUE()
                
        }).THEN(function(res1, res2) {
            ...
        }).THEN(
            ...
        ) 

As you can see, the control flow of the functions, wrapped with `TRY/CATCH/FINALLY` isn't managed by the standard `return` statement or explicit function end. 
Instead, to transfer the flow, you need to explicitly call the method on the embedded continuation instance, which is available as `this.CONT` (`this` scope can be passed as 2nd argument to TRY).

The call to such "control flow method" don't have to be synchronous - you can defer it arbitrary. This naturally allows to use them as callbacks (or errbacks).

However, the embedded continuation instance is only valid on the "synchronous interval" of the function execution. If you are deferring the call to the control flow method, 
either capture the continuation to the closure, or use one of the `getCONTINUE/getTHROW/getRETURN` methods (see the example above).

The arguments to the control flow method will become arguments to the next corresponding section of the flow. If the scope was passed as 2nd argument, it will propagate
as the scope of all further statements at the same nesting level.

        // CONTINUE transfers to next THEN section
        
        var tryScope = {}

        TRY(function (p1) {
            // p1 == 'p1'
            // this == tryScope 
        
            this.CONT.CONTINUE('value1', 'value2')

        }, tryScope).THEN(function(arg1, arg2) {
            // arg1 == 'value1', arg2 == 'value2'
            // this == tryScope 
            
            this.CONT.CONTINUE('value3', 'value4')
            
        }).THEN(function(arg1, arg2) {
            // arg1 == 'value3', arg2 == 'value4'
            // this == tryScope 
            
        }).NOW('p1') 

        
&nbsp;        

        // THROW transfers to the corresponding CATCH section
        
        var tryScope = {}
        var catchScope = {}

        TRY(function (p1) {
            // p1 == 'p1'
            // this == tryScope
        
            this.CONT.THROW('error1', 'error2')

        }).CATCH(function(arg1, arg2) {
            // arg1 == 'error1', arg2 == 'error2'
            // this == catchScope 
            
            this.CONT.CONTINUE('value3', 'value4')
            
        }, catchScope).FINALLY(function() {
            // this == tryScope
        
            this.CONTINUE()
            
        }).THEN(function(arg1, arg2) {
            // this == tryScope
            // arg1 == 'value3', arg2 == 'value4' 
            
        }).NOW('p1') 


Features
--------

- You can't return the value from the statement's function, using the standard `return`. Any value returned will throw an exception. 

- The `CATCH/FINALLY` statements are also "continued" - they have embedded continuation instance, and **do not** transfer the control flow **without call to `CONTINUE`** (or other method).
If you'll forget to call it - your control flow will remain inside of the `CATCH/FINALLY` statement

- Arguments to `CONTINUE` from inside the `CATCH` statement will be passed further on flow - to the next `THEN` section (***this may change in future versions***)

- Arguments to `CONTINUE` from inside the `FINALLY` statement will be ignored.

- You can pass the scope for the statement's function as the 2nd argument of any control flow method

- You can pass the arguments for the statement's function as the 3rd argument of any control flow method. This will *override* the arguments received from the previous statement (or from `NOW`, see below).


Activation
----------

The control flow, defined with the `TRY/CATCH/FINALLY` will not start immediately. To start it, call the `NOW` method of the continuation. 

Arguments to `NOW` will become the arguments to the initial statement (see the example above).     


Nesting
-------

You can nest the statements arbitrary. To do it, instead of global `TRY` use the `TRY` method of the embedded continuation:

        TRY(function () {
        
            this.CONT.TRY(function () {
                XHR.request({
                    url      : url,
                    data     : this.data,
                
                    callback : this.CONT.getCONTINUE(),
                    errback  : this.CONT.getTHROW(),
                })
            }).THEN(function () {
            
                // do something else
            
            }).NOW()
            
            
        }).CATCH(function (e1, e2) {
        
            ...
            
            this.CONT.CONTINUE()
        
        }).FINALLY(function () {
            
            this.CONT.TRY(function () {
                ...
                
                this.CONT.CONTINUE()    
            }).NOW()
                
        }).THEN(function(res1, res2) {
            ...
        }).THEN(
            ...
        ) 
    
    
Exceptions
----------

To raise the exceptions you have 2 options. If you are raising it, during the "synchronous interval" of the statement's function, you can just use the standard `throw`:

        TRY(function (arg1, arg2) {
        
            if (!arg1 || !arg2) throw new MyException({ description : 'Incorrect arguments' })
            
            ...
        
        }).CATCH(function (e) {
        
            this.CONT.CONTINUE()
        
        }).FINALLY(function () {
            ...
        }).NOW()


If you are raising it deferred, use the `THROW` method of the continuation:

        TRY(function (arg1, arg2) {
        
            var CONT = this.CONT
            
            XHR.request({
                errback  : function (err1, err2) {
                    
                    CONT.THROW(new MyException({ param1 : err1, param2 : err2 })) 
                }
            })
        
        }).CATCH(function (e) {
        
            this.CONT.THROW(e)
        
        }).FINALLY(function () {
            ...
        }).NOW()

Note, that with `THROW` you can throw (and accordingly catch) several values. If you are deferring call to `THROW`, you should use `getTHROW` (or a closure).

Exceptions from the nested statements will be correctly caught/handled by the outer `CATCH` statements. All `FINALLY` statements will be honored, in the correct order.

You can re-throw the exceptions from `CATCH/FINALLY` statements, to propagate it.


Statement boundaries
--------------------

When defining your control flow with `TRY/THEN/CATCH/FINALLY`, consider the following rules, which affect the scope of `CATCH/FINALLY` statements.

- `THEN` is just a synonym for `TRY`. Calls to `TRY/THEN` add statements to the sequential group.

- `CATCH/FINALLY` will handle the exceptions from the immediate previous sequential group

- `THEN` after `CATCH/FINALLY` will start a new sequential group 

- If you need to explicitly start a new sequential group use `NEXT`
 
Take a look on some illustrating examples:


        TRY(function () {                         |     try {
                                                  |         doSomething1()
            doSomething1()                        |         doSomething2()
                                                  |     } catch (e) {
        }).THEN(function() {                      |
                                                  |         doCatch()
            doSomething2()                        |              
                                                  |     } finally {
        }).CATCH(function() {                     |         doFinally()
                                                  |     }
            doCatch()                             |
                                                  |
        }).FINALLY(function () {                  |
                                                  |
            doFinally()                           |
        })                                        |

&nbsp;

        TRY(function () {                         |     doSomething1()
                                                  |    
            doSomething1()                        |     try {
                                                  |         doSomething2()
        }).NEXT(function() {                      |         
                                                  |     } catch (e) {
            doSomething2()                        |         doCatch()
                                                  |     } 
        }).CATCH(function() {                     |    
                                                  |     try {
            doCatch()                             |         
                                                  |         doSomething3()
        }).THEN(function (){                      |         
                                                  |     } finally {
            doSomething3()                        |         doFinally()
                                                  |     }
        }).FINALLY(function () {                  |
                                                  |
            doFinally()                           |
        })                                        |


Return
------

In any statement of the sequential group, you can also skip the rest of statements, using `RETURN`


        TRY(function (arg) {                      |     (function() {
                                                  |         if (!arg) return 'value1'
            if (!arg) this.CONT.RETURN('value1')  |         
                                                  |         doSomething1()
            doSomething1()                        |         doSomething2()
                                                  |     })()
        }).THEN(function() {                      |
                                                  |     doSomething3()
            doSomething2()                        |
                                                  |
        }).NEXT(function(arg) {                   |
            // arg == 'value1'                    |
                                                  |
            doSomething3()                        |   
        })                                        |
                                                  

Remember, if you are deferring the call to `RETURN`, either capture the continuation to closure, or use `getRETURN`
                                                  
                                                  
Parallel statements                               
-------------------

Along with sequential groups, you can run your flow in parallel, with the `AND` method of the continuation. 

Please note, that `AND` will change the type of the *whole current group* to parallel. So all previous calls to `THEN` in the current group will be considered
as parallel branches (**this may change in future versions**). But, *after* the type of current group has been changed to parallel, calls to `THEN` will start a new group
(you can always start a new sequential group with `NEXT`).

When entering the parallel group, all branches will receive the same arguments: 


        TRY(function (p) {                        |                NOW('param')
            //branch1, p == 'param'               |                     |
                                                  |                     |
                                                  |        /------------------------\
            this.CONT.CONTINUE('res1')            |        |       |        |       | 
                                                  |        |       |        |       |
        }).THEN(function(p) {                     |     branch1 branch2  branch3 branch4
            //branch2, p == 'param'               |        |       |        |       |       
                                                  |        |       |        |       |
            this.CONT.CONTINUE('res2')            |        \------------------------/
                                                  |                     |
        }).AND(function(p) {                      |                     |
            //branch3, p == 'param'               |        THEN([ [1], [2], [3], [4] ])      
                                                  |
            this.CONT.THROW('err3')               |
                                                  |
        }).AND(function(p) {                      |
            //branch4, p == 'param'               |           
                                                  |
            this.CONT.THROW('err4')               |
                                                  |
        }).THEN(function (arg) {                  |
                                                  |
            // arg == [                           |
            //     [ 'res1'], [ 'res2' ],         |
            //     [ 'err3'], [ 'err4' ]          |
            // ]                                  |
                                                  |
        }).NOW('param')                           |
                                                  |

The synchronization point will receive a single argument, which will be an array, containing the `arguments` objects with the results from each branch.
This array will be filled in order of branches **declaration**, not in the order they finished execution.

***The following convention may change in future versions:*** Each `AND` statement is implicitly wrapped with `CATCH`. So the whole parallel group will never
throw an exception (adding a `CATCH` statement to it will be a no-op, though  `FINALLY` statement will be honored). Instead, any exceptions from branches will be caught, 
and considered as the results. Its your responsibility to examine the resulting array and separate exceptions from normal results.


Synonyms
--------

The following upper-case methods of the continuation have lower-case synonyms:

        THEN      |   then
        NEXT      |   next
        AND       |   and
        NOW       |   now
        CATCH     |   except
        FINALLY   |   ensure
                  

<br><br>


USAGE IN JOOSE CLASSES
======================

For this mode, include the `lib/Task/JooseX/CPS/All.js` file in your deployment.

`continued` BUILDER
-------------------

Adding `JooseX.CPS` trait will provide your class with the `continued` builder. This builder groups the declarations of the "asynchronous part" of your class.
Inside of it, you can use the following builders: `methods`, `override`, `after`, `before`. This builders have the same meaning as standard ones, however instead of usual, 
they define the "continued" methods.


"Continued" methods
-------------------

These methods are called "continued", because they are implicitly wrapped with the "continued" `TRY` statement, described in the section above.
Inside of such methods, there is also embedded continuation instance, available as `this.CONT` 


        Class("DataStore", {
            trait : JooseX.CPS,
        
            continued : {
            
                methods : {
                
                    save : function (url) {
                        if (!url.test(/^http/) throw "Invalid URL"
                        
                        ...
                        
                        this.CONTINUE(result)
                    }
                }
            }
        })
        

Continued methods have the same [features][] as functions, wrapped with `TRY`, plus some important additional ones, see below.


Shortcuts
---------

The class with `JooseX.CPS` trait, will receive a `JooseX.CPS.ControlFlow` role, which will provide several shortcut methods: 

        TRY/THEN/AND/NEXT
        
        CATCH/FINALLY
        
        THROW/CONTINUE/RETURN
        
        getCONTINUE/getTHROW/getRETURN
    
All this methods just delegates to the embedded continuation instance.


Implicit methods chaining
-------------------------

"Continued" methods supports implicit methods chaining, and this allows you to write asynchronous code, that looks almost like synchronous one.

Consider the following example and its "raw" equivalent:   

        Class("Data.Store", {                     |    var store = new Data.Store()
            trait : JooseX.CPS,                   |    
                                                  |    // the "de-sugared" version of `update` method
            continued : {                         |    TRY(function (url) {
                                                  |        
                methods : {                       |        this.CONT.TRY(function () {
                                                  |            //do save
                    log : function () {           |            this.CONT.CONTINUE()
                        //do log                  |        }).THEN(function () {
                        this.CONTINUE()           |            //do log
                    },                            |            this.CONT.CONTINUE()
                                                  |        }).NOW()
                    save : function (url) {       |        
                        //do save                 |    }, store, [ 'http://my.site.com' ]).NOW()
                        this.CONTINUE()           |
                    },                            |
                                                  |
                    update : function (url) {     |
                        this.save(url)            |
                                                  |
                        this.log().now()          |
                    }                             |
                }                                 |
            }                                     |
        })                                        |
                                                  |
        var store = new Data.Store()              |
                                                  |
        store.update('http://my.site.com').now()  |
        
        
Technically, each call to "continued" method will pick up the current continuation, and delegate to its `TRY` method.
Thus, the sequential method calls will form a sequential statements group.

This will work for you as long as your whole method form a single source of exceptions. If you need a fine-tuned control 
over the areas from where the exceptions may came from, then fall-back to the usual control flow methods chaining.

For example, if you need this "exceptions layout" in your method:

        update : function (url) {
        
            this.save(url)
            
            try {
                this.log()
            } catch (e) {
            }
        }

then write it like:
        
        update : function (url) {   
                                   
            this.save(url).next(function () {
                
                this.log().now()
                
            }).except(function () {
            
               this.CONTINUE()
           
            }).now()
        }                           
        
Looks a bit noisier, but you can't get something for nothing, don't you?        
        
        
Cross-objects methods chaining 
------------------------------

The implicit methods chaining also works for the case, when you call "continued" methods of different objects. 
This works because single-threaded nature of JavaScript allows us to keep the global continuation instance. For example:

        Class("Data.Logger", {                   
            trait : JooseX.CPS,                 
                                                
            continued : {                       
                                                
                methods : {                     
                                                
                    log : function () {         
                        //do log                
                        this.CONTINUE()         
                    }                          
                }                               
            }                                   
        })
        
                                              
        Class("Data.Store", {                   
            trait : JooseX.CPS,
            
            has : {
                logger      : null,
            },                 
                                                
            continued : {                       
                                                
                methods : {
                                     
                    save : function (url) {     
                        //do save               
                        this.CONTINUE()         
                    },                          
                                                
                    update : function (url) {   
                        this.save(url)          
                                                
                        this.logger.log().now()        
                    }                           
                }                               
            }                                   
        })                                      
                                                
        var store = new Data.Store()            
                                                
        store.update('http://my.site.com').now()

Thing to note is that, the scope propagates along the statements chain and your should consider that. So, if in your "continued" method, you invoke the "continued" method of the another object,
the scope of the following `CATCH/FINALLY/THEN/NEXT` statements will be that object. To override it, pass 2nd argument to control flow method.

Take a look on the illustrating examples:


        update : function (url) {                 |    update : function (url) {           
            this.save(url)                        |        this.save(url)                  
                                                  |                                        
            var me      = this                    |        var me      = this              
            var logger  = this.logger             |        var logger  = this.logger                       
                                                  |                                        
            logger.log().then(function () {       |        logger.log().then(function () { 
                                                  |                                        
                // this == logger                 |            // this == me              
                                                  |                                        
            }).now()                              |        }, this).now()                  
        }                                         |    }                                   
                                                  
                                                  
"Continued" method modifiers                      
----------------------------

You can define the "continued" method modifiers as well. The only modifier type, that isn't supported is `augment`.
All other types works identically to their normal variants, just keep in mind that you need to explicitly call `CONTINUE` (or `THROW`)
to transfer the control flow from the modifier. In the same way, when using `override` don't forget that call to `this.SUPER()` will not start
the method immediately, you need to activate it: `this.SUPER().now()`


        Class("Data.Store.Improved", {
            trait : JooseX.CPS,
        
            continued : {
            
                override : {
                    log : function (arg) {
                        if (arg == 'something') 
                            this.SUPER().now()
                        else
                            throw "Wrong arguments"
                    }
                },
                
                methods : {
                    save : function () {
                        ...
                        
                        this.CONTINUE()
                    }
                },
            
                after : {
                
                    save : function () {
                        ...
                        
                        this.CONTINUE()
                    }
                }
            }
        })
  


Overriding usual methods with "continued" and vice-versa
--------------------------------------------------------

`JooseX.CPS` even allows you to freely mix the usual and "continued" methods in `override/after/before` modifiers.

That is, if your superclass defines a usual method, you can re-define it into the "continued" section just fine.
The same about the modifiers. Naturally, after such operation, your method will became "continued".

The vice-versa re-definition is also valid. 


GETTING HELP
============

This extension is supported via github issues tracker: <http://github.com/SamuraiJack/JooseX-CPS/issues>

For general Joose questions you can also visit the [#joose](http://webchat.freenode.net/?randomnick=1&channels=joose&prompt=1) on irc.freenode.org, or the forum at <http://joose.it/forum>


SEE ALSO
========

Continuation class: [JooseX.CPS.Continuation]

[Continuation Passing Style](http://en.wikipedia.org/wiki/Continuation-passing_style)

Web page of this extension: <http://github.com/SamuraiJack/JooseX-CPS/>

General information about Joose: <http://joose.it>


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at <http://github.com/SamuraiJack/JooseX-CPS/issues>



AUTHORS
=======

Nickolay Platonov <nplatonov@cpan.org>



COPYRIGHT AND LICENSE
=====================

Copyright (c) 2009, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Nickolay Platonov nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 

[JooseX.CPS.Continuation]: CPS/Continuation.html
