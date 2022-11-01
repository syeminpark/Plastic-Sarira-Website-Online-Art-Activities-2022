var ReturnTouchPos = function(e) {
    var x = 0,
        y = 0;
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
        var touch = evt.touches[0] || evt.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
        x = e.clientX;
        y = e.clientY;
    }
    return { x: x, y: y };
}

var ReturnMultiTouchPos = function(e) {
    var multipos = [];
    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
        var touch = evt.touches || evt.changedTouches;

        if (touch.length <= 1) return false;

        for (let i = 0; i < touch.length; i++) {
            multipos.push({
                x: touch[i].pageX,
                y: touch[i].pageY
            });
        }
    } else {
        return false;
    }

    return multipos;
}

var Length2D = function(vec2) {
    return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
}

var IsPointerAvailable = function() {
    return matchMedia('(pointer:fine)').matches;
}

var IsIOS = function(){
    return (/iPad|iPhone|iPod/.test(navigator.platform) ||
(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
!window.MSStream;
}

var IsIPhone = function(){
    return (/iPhone|iPod/.test(navigator.platform));
}

export { 
    ReturnTouchPos, ReturnMultiTouchPos, 
    Length2D, IsPointerAvailable,
    IsIOS, IsIPhone 
};