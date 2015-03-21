(function(window, undefined){
    
    $(function(){
        var Dragloader = function(options) {
            this.options = options;
            this.options.rotater = this.options.loader.find('span');
        };

        Dragloader.prototype = {
            constructor: Dragloader,
            
            init: function() {
                this.options.container.on('touchstart', this.startDrag()).
                on('touchmove', this.moveDrag()).
                on('touchend', this.endDrag());

                this.options.container.on('mousedown', this.startDrag()).
                on('mousemove', this.moveDrag()).
                on('mouseup', this.endDrag());
                // status: 0->空闲(结束)   1->开始   2->正在滑动
                this.status = 0;
            },
            
            startDrag: function() {
                var self = this;

                return function(event) {
                    if (self.status === 0) {
                        self.options.loader.removeClass('drag-loader-spinning').removeClass('drag-loader-off-canvas');
                        self.touchPosY = self.getPos(event).Y;
                        self.touchPosX = self.getPos(event).X;
                        self.startPosY = self.touchPosY;
                        self.loaderPosY = self.options.loader.css('top');
                        self.status = 1;
                    }
                };
            },
            
            moveDrag: function() {
                var self = this;

                return function(event) {
                    var posY = self.getPos(event).Y,
                        posX = self.getPos(event).X,
                        intervalY = posY - self.touchPosY,
                        degree = self.getRotationDegrees(self.options.rotater),
                        sign = intervalY/Math.abs(intervalY);

                    if (!self.checkDirection(posX, posY) && self.status == 1) {
                        return;
                    }
                    
                    if (self.status === 1 || self.status === 2) {
                        self.status = 2;
                        var oldTop = parseInt(self.options.loader.css('top'));
                        self.options.loader.css({
                            'top': oldTop + Math.floor(intervalY/3),
                        });
                        self.options.rotater.css({
                            '-webkit-transform': 'rotateZ(' + (degree + sign * 10) + 'deg)',
                               '-moz-transform': 'rotateZ(' + (degree + sign * 10) + 'deg)',
                                '-ms-transform': 'rotateZ(' + (degree + sign * 10) + 'deg)',
                                 '-o-transform': 'rotateZ(' + (degree + sign * 10) + 'deg)',
                                    'transform': 'rotateZ(' + (degree + sign * 10) + 'deg)'
                        });
                        self.touchPosY = self.getPos(event).Y;
                    }
                };
            },
            
            endDrag: function() {
                var self = this;

                return function(event) {
                    if (self.status === 2) {
                        self.status = 0;
                        var endPosY = self.getPos(event).Y;
                        if (endPosY - self.startPosY < 300) {
                            self.options.loader.removeAttr("style").addClass('drag-loader-off-canvas').removeClass('drag-loader-loading');
                            self.options.rotater.removeAttr("style");
                            return;
                        }
                        self.options.loader.removeAttr("style").addClass('drag-loader-loading');
                        self.options.rotater.removeAttr("style").addClass('drag-loader-spinning');
                        self.options.callback(function(){
                            self.options.loader.addClass('drag-loader-off-canvas').removeClass('drag-loader-loading');
                            self.options.rotater.removeClass('drag-loader-spinning');
                        });
                    }
                };
            },

            getPos: function(event) {
                if (!!event.originalEvent.changedTouches) {
                    return {
                        X: event.originalEvent.changedTouches[0].pageX,
                        Y: event.originalEvent.changedTouches[0].pageY
                    };
                } else {
                    return {
                        X: event.originalEvent.pageX,
                        Y: event.originalEvent.pageY
                    };
                }
            },

            checkDirection: function(posX, posY) {
                return Math.abs(posX - this.touchPosX) <= Math.abs(posY - this.touchPosY);
            },

            getRotationDegrees: function(obj) {
                var matrix = obj.css("-webkit-transform") ||
                                obj.css("-moz-transform") ||
                                 obj.css("-ms-transform") ||
                                  obj.css("-o-transform") ||
                                     obj.css("transform");
                if (matrix !== 'none') {
                    var values = matrix.split('(')[1].split(')')[0].split(',');
                    var a = values[0];
                    var b = values[1];
                    var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
                } else {
                    var angle = 0;
                }

                if (angle < 0) {
                    angle += 360;
                }
                return angle;
            }
        };


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
        ld.init();
    });
}(window));