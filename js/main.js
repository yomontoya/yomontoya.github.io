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
            }
        };

        var random_pause = RandomNumber.getRandomPause(),
            random_blink_number = RandomNumber.getRandomBlinking(),
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
                // console.log(Interference.getElement().width ,Interference.getElement().height)
                // new_interference.width =inner_width*1200/1600;
                // new_interference.height =inner_height*1600/1200;
                new_interference.src = interference_element.dataset.image;
                // console.log( new_interference.width,  new_interference.height )
                ctx_interference = Interference.getElement().getContext('2d');

                new_interference.onload = function() {
                    // ctx_interference.drawImage( this, 0, 0, inner_width, inner_height);
                    // ctx_interference.blendOnto( ctx_over, 'colorburn' , { destX: 0 , destY: 0 } );
                };
            }
            // Quick version with no animation
            if ( classListHelper.has(document.body, 'home') ) {
                for (var i = 0; i <= 10; i++) {
                    var original_interference = new Image(),
                        random_interference_id =  i,
                        new_interference = new Image();
                    loadInterference();

                    // Store current image
                    original_interference.src = interference_element.dataset.image;

                    // update new image with random number
                    new_interference.src = image_path+'interference-' + random_interference_id + '.jpg';
                    
                    // Store the new image
                    interference_element.dataset.image = image_path+'interference-' + random_interference_id + '.jpg';  
                    interference_element.dataset.image_id = random_interference_id;  

                    new_interference.onload = function() {
                        showInterference( this, 0  , random_interference_id);
                    };
                }
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

                ctx_logo.drawImage( logo_image, 0, 0);
                ctx_over.drawImage( img , 0, 0,  inner_width, inner_height);
                ctx_logo.blendOnto( ctx_over, 'multiply', coordinates );
               
            }, time );
        } 
        var arrayInterference = [];
        var animationStopped = false;
        function showInterference( interference, time , id ) {

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
                ctx_interference.drawImage( interference , 0, 0,  interference_width, interference_height);
                ctx_interference.blendOnto( ctx_over, 'darken', { destX: 0 , destY: 0 } );

               // var randomShowing = RandomNumber.getRandomShowCover();
               
               // if ( elem_over.dataset.image.indexOf('0') !== -1 && randomShowing === 1 && !animationStopped) {
               //      BackgroundAnimation.stop();
               //      animationStopped = true;
               //  }
               //  if ( animationStopped && arrayInterference.indexOf(id) === -1 ) {
               //     arrayInterference.push(id)
               //  }
               //  // console.log( animationStopped, arrayInterference.length )
               //  if ( arrayInterference.length == 11 ) {
               //      setTimeout(function() {
               //          BackgroundAnimation.stopInterference();
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
        /**
         * Background Animiation
         * @type {Object}
         */
        var BackgroundAnimation = {
            interval_id: '',
            interval_interference_id: '',
            start: function() {
                
                this.interval_id = setInterval( function() {

                     var original_image = new Image(),
                         random_id =  RandomNumber.getRandomId(),
                         new_image = new Image();
                    // Store current image
                    original_image.src = elem_over.dataset.image;

                    // update new image with random number
                    new_image.src = image_path+'background-' + random_id + '.jpg';
                    
                    // Store the new image
                    elem_over.dataset.image = image_path+'background-' + random_id + '.jpg';  

                    // On load start blinking and display the new background
                    new_image.onload = function() {
                        showImage( this, 100  );
                        showImage( original_image, 200 );
                        showImage( this, 300 );
                        if ( random_blink_number == 1 ) { return; }
                        
                        showImage( original_image, 400 );
                        showImage( this, 500 );
                        if ( random_blink_number == 2 ) { return; }
                        
                        showImage( original_image, 600 );
                        showImage( this, 700 );
                    };

                    // Reset
                    random_pause = RandomNumber.getRandomPause();
                    random_blink_number = RandomNumber.getRandomBlinking();

                }, random_pause*1000 );
                
                this.interval_interference_id = setInterval( function() {
                    var original_interference = new Image(),
                        random_interference_id =  RandomNumber.getRandomInterferenceId(),
                        new_interference = new Image();

                    if ( random_interference_id != interference_element.dataset.image_id ) {

                        // Store current image
                        original_interference.src = interference_element.dataset.image;

                        // update new image with random number
                        new_interference.src = image_path+'interference-' + random_interference_id + '.jpg';
                        
                        // Store the new image
                        interference_element.dataset.image = image_path+'interference-' + random_interference_id + '.jpg';  
                        interference_element.dataset.image_id = random_interference_id;  

                        new_interference.onload = function() {
                            showInterference( this, 0  , random_interference_id);
                        };
                    }
                }, 1800 );
            },
            stop: function() {
                clearInterval( this.interval_id );
            },
            stopInterference: function() {
                clearInterval( this.interval_interference_id );
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
            // BackgroundAnimation.start();
        }


        document.getElementById('show-live').addEventListener('click', function(e) {
            e.preventDefault();
            var Box = document.getElementById('live-box');
            var contentBox = document.getElementById('content-box');
            classListHelper.remove( Box, 'hidden');
            classListHelper.add( contentBox, 'hidden');
            // setTimeout(function() {
                inner_height = document.body.scrollHeight;
                inner_width = document.body.clientWidth;
            // },10)
            updateCanvas();
        }); 
        document.getElementById('show-contact').addEventListener('click', function(e) {
            e.preventDefault();
            var Box = document.getElementById('contact-box');
            var contentBox = document.getElementById('content-box');
            classListHelper.remove( Box, 'hidden');
            classListHelper.add( contentBox, 'hidden');
            inner_height = document.body.scrollHeight+10;
            inner_width = document.body.clientWidth;
            updateCanvas();
        });
        var buttonBackHome = document.querySelectorAll('.js-back-home');
        for (var i = 0; i < buttonBackHome.length; i++) {
            buttonBackHome[i].addEventListener('click', function(e) {
                e.preventDefault();
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