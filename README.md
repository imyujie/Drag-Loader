# Drag-Loader
jQuery drag to load.

##HOW TO USE
1. Add the HTML code in your website. (Needs jQuery)

    <link rel="stylesheet" href="loader.css">
    <script src="drag.js"></script>
    <!-- Loader -->
    <div class="loader">
        <span>
            <i class="icon-cw"></i>
        </span>
    </div>

2. Use it in JavaScript code like this,
    
    // callback is the function excuting when loader is spinning.
    var ld = new Dragloader({
        loader: $('.loader'),
        container: $('body'),
        callback: function(fn) { 
            setTimeout(
                function(){
                    fn();
                },
            3000);
        }
    });
    // call it
    ld.init();