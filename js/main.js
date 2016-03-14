document.addEventListener('DOMContentLoaded', function(){
    var image_path = '/img/';
    var classListHelper = {
        add: function( el , className ){
            if (el.classList) {
                el.classList.add(className);
            } else {
                el.className += ' ' + className;
            }
        }, 
        remove: function( el , className ){
            if (el.classList) {
                el.classList.remove(className);
            } else {
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        },
        has: function( el , className ){
            if (el.classList) {
                return el.classList.contains(className);
            } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
            }
        }
    };
    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    
   // Background Animation
    (function()  {

        /**
         * Logo position and element
         * @type {Object}
         */
        var logo_element = document.getElementById('logo-placeholder');
        var logo_montoya_element = document.getElementById('logo-montoya-placeholder');
        var Logo = {
            offset_top: 150,
            offset_left: 135,
            getTop: function() {
                if ( window.innerHeight <= 400 ) {
                    return 50;
                }
                return Math.floor( (window.innerHeight / 2) - this.offset_top );
            }, 
            getLeft: function() {
                return Math.floor( (window.innerWidth / 2) - this.offset_left );
            },
            getElement: function() {
                return logo_element;
            },
            getCoordinates: function() {
                return { destX:  this.getLeft(), destY: this.getTop() };
            }
        };
        var interference_element = document.getElementById('interference-placeholder');
        var Interference = {
            getElement: function() {
                return interference_element;
            }
        };

        /**
         * Set interval for each type of random number
         * @type {Object}
         */
        var RandomNumber = {
            getRandomShowCover: function()
            {
                return randomIntFromInterval(1,2);
            },
            getRandomCoverPause: function()
            {
                return randomIntFromInterval(3,7);
            },
            getRandomPause: function()
            {
                return randomIntFromInterval(2,4);
            },
            getRandomBlinking: function() {
                return randomIntFromInterval(1,3);
            },
            getRandomId: function() {
                return randomIntFromInterval( 0 , 6 );
            },
            getRandomInterferenceId: function() {
                  return randomIntFromInterval( 0 , 10 );
            },
            getRandomInterferenceNumber: function() {
                  return randomIntFromInterval( 0 , 10 );
            }
        };

        var random_pause = RandomNumber.getRandomPause(),
            random_blink_number = RandomNumber.getRandomBlinking(),
            interference_number = RandomNumber.getRandomInterferenceNumber(),
            coordinates =  Logo.getCoordinates(),
            inner_width = document.body.clientWidth,
            inner_height = document.body.scrollHeight,
            ctx_logo =  logo_element.getContext('2d'),
            ctx_logo_montoya =  logo_montoya_element.getContext('2d'),
            elem_over =  document.getElementById('background-animation'),
            ctx_over = elem_over.getContext('2d'),
            logo_image = new Image(),
            logo_montoya_image = new Image();

       // Set logo size
       logo_element.width  = 269;
       logo_element.height = 132; 

       // Set logo size
       logo_montoya_element.width  = 152;
       logo_montoya_element.height = 65;


        function updateCanvas() {
            var new_background = new Image(),
                new_interference = new Image();

            elem_over.width  = inner_width;
            elem_over.height = inner_height; 
            // console.log(inner_width)
            // console.log(elem_over.height)
            // Load the new image, this is offscreen
            new_background.src =  elem_over.dataset.image;
            new_background.onload = function() {
                ctx_over.drawImage( this , 0, 0,  inner_width, inner_height);
                
                if ( classListHelper.has(document.body,'home') ) {
                    loadLogo();
                } else {
                    loadLogoMontoya();
                }
            };

            function loadLogo() {
                logo_image.src = image_path+'logo.jpg';
                logo_image.onload = function() {
                    ctx_logo.drawImage(this, 0, 0);
                    ctx_logo.blendOnto( ctx_over, 'multiply', coordinates );
                    loadInterference();
                };
            } 
            function loadLogoMontoya() {
                logo_montoya_image.src = image_path+'montoya.jpg';
                logo_montoya_image.onload = function() {
                    ctx_logo_montoya.drawImage(this, 0, 0);
                    ctx_logo_montoya.blendOnto( ctx_over, 'multiply', { destX:  Math.floor( (window.innerWidth / 2) - (logo_montoya_element.width / 2) ), destY: 40 } );
                    loadInterference();
                };
            }

            function loadInterference() {
                Interference.getElement().width = inner_width;
                Interference.getElement().height = inner_height;
                new_interference.src = interference_element.dataset.image;
                ctx_interference = Interference.getElement().getContext('2d');
            }
        }
        
        /**
         * Show Image
         * @param  {object} img  Image object to show
         * @param  {int} time    Duration of the image displayed
         * @return {void}
         */
        
        function showImage( img, time ) {
            setTimeout( function() {
                if ( classListHelper.has(document.body,'home') ) {
                    ctx_logo.drawImage( logo_image, 0, 0);
                    ctx_over.drawImage( img , 0, 0,  inner_width, inner_height);
                    ctx_logo.blendOnto( ctx_over, 'multiply', coordinates );
                } else {
                    ctx_logo_montoya.drawImage(this, 0, 0);
                    ctx_logo_montoya.blendOnto( ctx_over, 'multiply', { destX:  Math.floor( (window.innerWidth / 2) - (logo_montoya_element.width / 2) ), destY: 40 } );
                }
            }, time );
        } 
        var arrayInterference = [];
        var animationStopped = false;
        function showInterference( interferences, time ) {

            setTimeout( function() {
                var ratio_width = 1600 / inner_width; 
                var ratio_height = 1200 / inner_height;
                var interference_width = 0;
                var interference_height = 0;
                // console.log(ratio_width,ratio_height)
                if ( ratio_width < ratio_height ) {
                    interference_width =  inner_height*1600/1200;
                    interference_height = inner_height;
                    // console.log(interference_width,interference_height)
                } else {
                    interference_width =  inner_width;
                    interference_height = inner_width*1200/1600;
                }
                for (var i = 0; i < interferences.length; i++) {
                    ctx_interference.drawImage( interferences[i] , 0, 0,  interference_width, interference_height);
                    if ( interferences[i].src.indexOf('10') !== -1 ) {
                        ctx_interference.blendOnto( ctx_over, 'darken', { destX: 0 , destY: 0 } );
                    } else {
                        ctx_interference.blendOnto( ctx_over, 'darken', { destX: inner_width - interference_width, destY: 0 } );
                    }
                }
                // console.log(id)


               // var randomShowing = RandomNumber.getRandomShowCover();
               
               // if ( elem_over.dataset.image.indexOf('0') !== -1 && randomShowing === 1 && !animationStopped) {
               //      BackgroundAnimation.stop();
               //      BackgroundAnimation.stopInterference();
               //      console.log('animation stopped')
               //      animationStopped = true;
               //  }
               //  if ( animationStopped && arrayInterference.indexOf(id) === -1 ) {
               //     arrayInterference.push(id)
               //  }
               //  // console.log( animationStopped, arrayInterference.length )
               //  if ( arrayInterference.length == 11 ) {
               //      setTimeout(function() {
               //          BackgroundAnimation.start();
               //          arrayInterference = [];
               //          animationStopped = false;
               //      }, RandomNumber.getRandomCoverPause()* 1000 )
               //   }
               //   if ( !animationStopped ) {
               //      arrayInterference = [];
               //  }
            }, time );
        }

        // Preloading images 
        var storeBackgrounds = [];
        var storeCurrentBackground;
        for (var i = 0; i <= 6; i++) {
            var image = new Image();
            image.src = image_path+'background-' + i + '.jpg';
            if ( i === 0 ) {
                storeCurrentBackground = image;
            }
            image.onload = function() {
                this.isLoaded = true;
                storeBackgrounds.push(this);
            }
        }
        // Preloading images 
        var storeInterferences = [];
        for (var i = 0; i <= 10; i++) {
            var image = new Image();
            image.src = image_path+'interference-' + i + '.jpg';
            image.onload = function() {
                this.isLoaded = true;
                storeInterferences.push(this);
            }
        }


        /**
         * Background Animiation
         * @type {Object}
         */
        var BackgroundAnimation = {
            interval_id: '',
            interval_interference_id: '',
            start: function() {
                
                this.interval_id = setInterval( function() {

                    var random_id =  RandomNumber.getRandomId();
                    var original_image = storeCurrentBackground;

                    if ( storeBackgrounds[random_id].isLoaded == true && original_image !== undefined) {
                        BackgroundAnimation.showBackgrounds(original_image, storeBackgrounds[random_id], random_blink_number );
                    }
                    // Reset
                    random_pause = RandomNumber.getRandomPause();
                    random_blink_number = RandomNumber.getRandomBlinking();

                }, random_pause*1400 );
                
                this.interval_interference_id = setInterval( function() {
                    var interferences = [];

                    for (var i = 0; i <= interference_number; i++) {
                        var random_interference_id =  RandomNumber.getRandomInterferenceId();
                        if ( storeInterferences[random_interference_id].isLoaded == true ) {
                            interferences.push(storeInterferences[random_interference_id]);
                        }
                    }
                    showInterference(interferences, 0);
                    interference_number = RandomNumber.getRandomInterferenceNumber();
                }, 1800 );
            },
            stop: function() {
                clearInterval( this.interval_id );
            },
            stopInterference: function() {
                clearInterval( this.interval_interference_id );
            },
            showBackgrounds: function(original_image, new_image, random_blink_number) {
                // console.log(typeof original_image, typeof new_image)
                showImage( new_image, 100  );
                showImage( original_image, 200 );
                showImage( new_image, 300 );
                if ( random_blink_number == 1 ) { return; }
                
                showImage( original_image, 400 );
                showImage( new_image, 500 );
                if ( random_blink_number == 2 ) { return; }
                
                showImage( original_image, 600 );
                showImage( new_image, 700 );
            }
        };
      
        // On resize 
        window.addEventListener('resize', function() {
            // Update values
            coordinates =  Logo.getCoordinates();
            inner_width = document.body.clientWidth;
            inner_height = document.body.scrollHeight;
            // console.log(inner_height)
            // Update canvas
            updateCanvas();
        });

        // Update canvas based on window size 
        updateCanvas();

        // Start animation
        if ( classListHelper.has(document.body, 'home') ) {
            BackgroundAnimation.start();
        }


        document.getElementById('show-live').addEventListener('click', function(e) {
            e.preventDefault();
            classListHelper.add(document.body,'live-page');
            classListHelper.remove(document.body,'home');
            var Box = document.getElementById('live-box');
            var contentBox = document.getElementById('content-box');
            classListHelper.remove( Box, 'hidden');
            classListHelper.add( contentBox, 'hidden');
            setTimeout(function() {
                inner_height = document.body.scrollHeight;
                inner_width = document.body.clientWidth;
            },10);
            updateCanvas();
        }); 
        document.getElementById('show-contact').addEventListener('click', function(e) {
            e.preventDefault();
            classListHelper.add(document.body,'contact-page');
            classListHelper.remove(document.body,'home');
            var Box = document.getElementById('contact-box');
            var contentBox = document.getElementById('content-box');
            classListHelper.remove( Box, 'hidden');
            classListHelper.add( contentBox, 'hidden');
            setTimeout(function() {
            inner_height = document.body.scrollHeight+10;
            inner_width = document.body.clientWidth;
            },10);
            updateCanvas();
        });
        var buttonBackHome = document.querySelectorAll('.js-back-home');
        for (var i = 0; i < buttonBackHome.length; i++) {
            buttonBackHome[i].addEventListener('click', function(e) {
                e.preventDefault();
                classListHelper.remove(document.body,'live-page');
                classListHelper.remove(document.body,'contact-page');
                classListHelper.add(document.body,'home');
                var contactBox = document.getElementById('contact-box');
                var liveBox = document.getElementById('live-box');
                var contentBox = document.getElementById('content-box');
                classListHelper.remove( contentBox, 'hidden');
                classListHelper.add( contactBox, 'hidden');
                classListHelper.add( liveBox, 'hidden');
                inner_height = window.innerHeight;
                inner_width = window.innerWidth;
                updateCanvas();
            });
        }
    }());

    /**
     * Soundcloud player
     * @return {void}
     */
    (function(){

        var SoundcloudHelper = {
            init: function( widgetIframe, play_button_container, play_button ) {
                // var widgetIframe = document.getElementById('sc-widget'),
                var widget       = SC.Widget(widgetIframe);
                    // play_button = document.getElementById('play-button');

                widget.bind(SC.Widget.Events.READY, function() {

                    classListHelper.remove(play_button_container, 'invisible');
                    play_button.addEventListener('click', function() {

                        // if ( classListHelper.has( this, 'loading') ) { return; }
                        if ( classListHelper.has( this, 'pause') ) {
                            this.innerHTML = 'Pause';
                            classListHelper.remove( this, 'pause');
                            widget.play();
                        }
                        else {
                            widget.pause();
                            this.innerHTML = 'Play';
                            classListHelper.add( this, 'pause');
                        }
                    });
                });
                document.getElementById('next-track').addEventListener('click', function(e) {
                    widget.seekTo(0);
                    widget.next();
                }); 
                document.getElementById('previous-track').addEventListener('click', function(e) {
                    widget.seekTo(0);
                    widget.prev();
                });
                // widget.bind( SC.Widget.Events.LOAD_PROGRESS, function() {
                //     play_button.innerHTML = 'Loading';
                //     classListHelper.add( play_button, 'loading');
                // }); 
                widget.bind( SC.Widget.Events.PLAY_PROGRESS, function() {
                    play_button.innerHTML = 'Pause';
                    // classListHelper.remove( play_button, 'loading');
                }); 
                widget.bind( SC.Widget.Events.PAUSE, function() {
                    play_button.innerHTML = 'Play';
                });
                widget.bind(SC.Widget.Events.FINISH, function() {
                    play_button.innerHTML = 'Play';
                    classListHelper.add( play_button, 'pause');
                });
            }
        };
        if ( classListHelper.has(document.body, 'home') ) {
            SoundcloudHelper.init( document.getElementById('sc-widget'), document.getElementById('play-button-container'), document.getElementById('play-button') );
        }
    }());
});