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


JooseX.CPS - Some syntax sugar, enabling ["Continuation Passing Style"] for Joose methods


SYNOPSIS
========

        Class("Point", {
        
            has: {
                x: {is: "ro"},
                y: {is: "rw"},
            },
            
            methods: {
                clear: function () {
                    var x = this.getX()
                    this.setY(0)
                }
            }
        })
        
        Class("Point.ThreeD", {
        
            isa: Point,
            
            has: {
                z: {}
            },
            
            after: {
                clear: function () {
                    this.z = 0
                }
            }
        })
        
        var point = new Point.ThreeD({
            x : 1,
            y : 2,
            z : 3
        })


DESCRIPTION
===========

Joose is a self-hosting meta object system for JavaScript with support for classes, inheritance, roles (aka traits), method modifiers and much more.

The main goal of Joose is to make JavaScript Object Oriented Programming easier, more consistent and less tedious. With Joose you can to think more about what you want to do and less about the mechanics of OOP.

The Joose framework has been successfully used in multiple production systems for twelve months now and has been proven to be very stable. 
Joose is being tested using an automated unit-test suite that is being run in all major browsers (Firefox, IE, Safari, Opera and Chrome).

Joose core package is only 8kb (YUI+gz).




CAVEATS
=======

The moment of trait application.

Attributes in traits.

Refering to meta instance from the constructor

Method modifiers order in Rhino

</div>


GETTING HELP
============

We offer both a mailing list and an active IRC channel.

The mailing list is <a href="mailto:joose-js@googlegroups.com">joose-js@googlegroups.com</a>. To subscribe, visit: [http://groups.google.com/group/joose-js](http://groups.google.com/group/joose-js)

You can also visit us at #joose on irc.freenode.org. Questions at all levels (on Joose-related topics ;) are welcome.


ACKNOWLEDGEMENTS
================

Many thanks to the whole Moose community for being icebreaker in the meta world. 

Special thanks to Dave Rolsky for the excellent Moose documentation written, on which this document is based.


SEE ALSO
========

[http://code.google.com/p/joose-js/](http://code.google.com/p/joose-js/)

This is the official web home of Joose.

[http://github.com/Joose/Joose](http://github.com/Joose/Joose)

Our version control repository.

[http://www.iinteractive.com/moose](http://www.iinteractive.com/moose)

Home page of Moose - post-modern class system for perl


BUGS
====

All complex software has bugs lurking in it, and this module is no exception.

Please report any bugs through the web interface at [http://code.google.com/p/joose-js/issues/list](http://code.google.com/p/joose-js/issues/list)


FEATURE REQUESTS
================

We are very strict about what features we add to the Joose core, especially the user-visible features. Instead we have made sure that the underlying meta-system of Joose is as extensible as possible so that you can add your own features easily.

That said, occasionally there is a feature needed in the meta-system to support your planned extension, in which case you should 
either email the mailing list ([joose-js@googlegroups.com](mailto:joose-js@googlegroups.com)) or join us on IRC at <irc://irc.freenode.org/#joose> to discuss. 
The [Joose.Manual.Contributing][8] has more detail about how and when you can contribute.


AUTHORS
=======

Nickolay Platonov [root@symbie.org](mailto:root@symbie.org)



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
