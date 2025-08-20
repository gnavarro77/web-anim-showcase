class AnimValue {
    
    _duration = 1000;
    _currentValue = null;
    _targetValue = null;
    
    constructor(value, dur){
        this._duration = dur;
        this._targetValue = value;
    }
    

    next(time){
        let value = null;
        if (time < dur) {
            value = this._currentValue = (time / dur) * this._targetValue;   
        }
        return value;
    }
    
    

    //window.requestAnimationFrame(self._zoomIn.bind(self))
    
    
    
    
}