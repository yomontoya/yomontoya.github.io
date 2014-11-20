document.addEventListener('DOMContentLoaded', function(){
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
        var Logo = {
            offset_top: 88,
            offset_left: 150,
            getTop: function() {
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
            getRandomPause: function()
            {
                return randomIntFromInterval(2,4);
            },
            getRandomBlinking: function() {
                return randomIntFromInterval(1,3);
            },
            getRandomId: function() {
                return randomIntFromInterval( 0 , 12 );
            },
            getRandomInterferenceId: function() {
                  return randomIntFromInterval( 0 , 1 );
            }
        };

        var random_pause = RandomNumber.getRandomPause(),
            random_blink_number = RandomNumber.getRandomBlinking(),
            coordinates =  Logo.getCoordinates(),
            inner_width = window.innerWidth,
            inner_height = window.innerHeight,
            ctx_logo =  logo_element.getContext('2d'),
            elem_over =  document.getElementById('background-animation'),
            ctx_over = elem_over.getContext('2d'),
            logo_image = new Image();
       
       // Set logo size
       logo_element.width  = 310;
       logo_element.height = 129;


        function updateCanvas() {
            var new_background = new Image(),
                new_interference = new Image();

            elem_over.width  = inner_width;
            elem_over.height = inner_height; 

            // Load the new image, this is offscreen
            new_background.src =  elem_over.dataset.image;
            new_background.onload = function() {
                ctx_over.drawImage( this , 0, 0,  inner_width, inner_height);
                loadLogo();    
            };

         
            function loadLogo() {
                logo_image.src = 'img/logo.jpg';
                logo_image.onload = function() {
                    ctx_logo.drawImage(this, 0, 0);
                    ctx_logo.blendOnto( ctx_over, 'multiply', coordinates );
                    loadInterference();
                };
            }

            function loadInterference() {
                Interference.getElement().width = 1200;
                Interference.getElement().height = 900;

                new_interference.src = interference_element.dataset.image;
                ctx_interference = Interference.getElement().getContext('2d');

                new_interference.onload = function() {
                    // ctx_interference.drawImage( this, 0, 0, inner_width, inner_height);
                    // ctx_interference.blendOnto( ctx_over, 'colorburn' , { destX: 0 , destY: 0 } );
                };
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
        function showInterference( interference, time , id ) {

            setTimeout( function() {
               ctx_interference.drawImage( interference , 0, 0);
               var effect = 'multiply';
               if ( id === 0 || id === 1 ) {
                    effect = 'colorburn';
               }
               var coordinates = { destX: 0 , destY: 0 };
               switch( id ) {
                    case 0:
                        coordinates = { destX: 0 , destY: -200 };
                    break;
                    case 1:
                        coordinates = { destX: inner_width - 900 , destY: -130 };
                    break;
               }
              
               ctx_interference.blendOnto( ctx_over, effect, coordinates );
            }, time );
        }
        /**
         * Background Animiation
         * @type {Object}
         */
        var BackgroundAnimation = {
            interval_id: '',
            start: function() {
                
                this.interval_id = setInterval( function() {

                     var original_image = new Image(),
                         random_id =  RandomNumber.getRandomId(),
                         new_image = new Image();

                    // Store current image
                    original_image.src = elem_over.dataset.image;

                    // update new image with random number
                    new_image.src = 'img/background-' + random_id + '.jpg';
                    
                    // Store the new image
                    elem_over.dataset.image = 'img/background-' + random_id + '.jpg';  

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
                
                setInterval( function() {
                    var original_interference = new Image(),
                        random_interference_id =  RandomNumber.getRandomInterferenceId(),
                        new_interference = new Image();

                    if ( random_interference_id != interference_element.dataset.image_id ) {

                        // Store current image
                        original_interference.src = interference_element.dataset.image;

                        // update new image with random number
                        new_interference.src = 'img/interference-' + random_interference_id + '.jpg';
                        
                        // Store the new image
                        interference_element.dataset.image = 'img/interference-' + random_interference_id + '.jpg';  
                        interference_element.dataset.image_id = random_interference_id;  

                        new_interference.onload = function() {
                            showInterference( this, 0  , random_interference_id);
                        };
                    }
                }, 1800 );
            },
            stop: function() {
                clearInterval( this.interval_id );
            }
        };
      
        // On resize 
        window.addEventListener('resize', function() {
            // Update values
            coordinates =  Logo.getCoordinates();
            inner_width = window.innerWidth;
            inner_height = window.innerHeight;

            // Update canvas
            updateCanvas();
        });

        // Update canvas based on window size 
        updateCanvas();

        // Start animation
        BackgroundAnimation.start();

    }());

    /**
     * Soundcloud player
     * @return {void}
     */
    (function(){
        var widgetIframe = document.getElementById('sc-widget'),
            widget       = SC.Widget(widgetIframe),
            play_button = document.getElementById('play-button');

        widget.bind(SC.Widget.Events.READY, function() {

            classListHelper.remove(play_button, 'hidden');
            play_button.addEventListener('click', function() {

                if ( classListHelper.has( this, 'loading') ) { return; }
                if ( classListHelper.has( this, 'pause') ) {
                    this.innerHTML = 'Loading';
                    classListHelper.add( this, 'loading');
                    widget.play();
                }
                else {
                    widget.pause();
                    this.innerHTML = 'Play';
                    classListHelper.add( this, 'pause');
                }
            });
        });
        widget.bind( SC.Widget.Events.LOAD_PROGRESS, function() {
            play_button.innerHTML = 'Loading';
            classListHelper.add( play_button, 'loading');
        }); 
        widget.bind( SC.Widget.Events.PLAY_PROGRESS, function() {
            play_button.innerHTML = 'Pause';
            classListHelper.remove( play_button, 'loading');
        }); 
        widget.bind( SC.Widget.Events.PAUSE, function() {
            play_button.innerHTML = 'Play';
        });
        widget.bind(SC.Widget.Events.FINISH, function() {
            play_button.innerHTML = 'Play';
            classListHelper.add( play_button, 'pause');
        });
    }());
});