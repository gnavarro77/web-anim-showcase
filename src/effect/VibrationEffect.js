class VibrationEffect {
    
    _path = null;
    _center = null;
    _opts = {
        offset : 0,
        duration : 1000,
        orientation : 'horizontal'
    }
    
    _parts = [];
    _time = {
        current : 0,
        start : 0
    }
    
    
    constructor(path, opts = {}) {
        this._path = path;
        this._opts = Object.assign(this._opts, opts);
        this._init();
    }
    
    

    _init(){
        const self = this;
        
        const {x,y,w,h} = self._path.getBBox();
        
        self._center = {
            x: x+w/2,
            y: y+h/2
        };
        
        let d = self._path.attr('d');
        d = SmartSVGPath.toAbsolute(d);
        const cmd = SmartSVGPath.getCommands(d);
        const last = cmd[1].substring(1).replace(' ',',');
        
        self._parts.push(cmd[0]);
        self._parts.push(last);
        
        d = [cmd[0],
             `C ${self._center.x},${self._center.y} ${self._center.x},${self._center.y}`,
             last
            ]
        .join(' ');
        console.log('d : ' + d);
        self._path.attr('d', d);
    }
    

    _update(offset){
        let bezier = `C ${this._center.x},${this._center.y + offset} ${this._center.x},${this._center.y + offset}`;
        if (this._opts.orientation == 'vertical') {
            bezier = `C ${this._center.x  + offset},${this._center.y} ${this._center.x  + offset},${this._center.y}`;
        }
        
        const d = [this._parts[0],
             bezier,
             this._parts[1]
            ]
        .join(' ');
        console.log(d);
        this._path.attr('d', d);
    }


    _animate(valueResolver, time) {
        let self = this;
        
        if (self._time.start == 0){
            self._time.start = time;
        }
        self._time.current = time - self._time.start;
        console.log('time : ' + self._time.current);
        //let value = (self._time.current / this._opts.duration) * this._opts.offset; 
        let value = valueResolver();
        console.log('value : ' + value);
        self._update(value);
        if (self._time.current < this._opts.duration) {
            window.requestAnimationFrame(self._animate.bind(this, valueResolver));
        } else {
            self._onPhaseCompleted(valueResolver.name);
        }    
    }
    
    _phase1() {
        return (this._time.current / this._opts.duration) * this._opts.offset; 
    }

    _phase2() {
        return this._opts.offset - ((this._time.current / this._opts.duration) * this._opts.offset); 
    }

    _phase3() {
        return -this._phase1(); 
    }

    _phase4() {
        return -this._phase2(); 
    }


    _onPhaseCompleted(funcName) {
        this._time.start=0;
        let phase = Number(funcName.slice(-1));
        if (phase == 4){
            phase = 1;
        } else {
            phase += 1;
        }
        const valueResolver = this["_phase" + phase];        
        window.requestAnimationFrame(this._animate.bind(this, valueResolver.bind(this)));
    }


    run(){
        window.requestAnimationFrame(this._animate.bind(this, this._phase1.bind(this)));
    }


}