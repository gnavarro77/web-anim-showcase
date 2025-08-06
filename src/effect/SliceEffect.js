class SliceEffect {
    
    _target = null;
    _clone = null;

    _cutLine = null;


    _options = {
        'clip' : {
            percent : 50,
            color : '#c8b7c4'
        },
        'cut' : {
            docut : false,
            color : 'white',
            opacity : 0.8,
            width : 1,
            dur : 1000
        },
        slide : {
            dur : 1000,
            offsetX : 1,
            offsetY : 1
        }
    };
    
    
    constructor(elt, options = {}){
        this._target = elt;
        this._options.cut = Object.assign(this._options.cut, options.cut);
        this._options.clip = Object.assign(this._options.clip, options.clip);
        this._options.slide = Object.assign(this._options.slide, options.slide);
    }

    

    async run(dur = 1000, ease = mina.linear) {
        let self = this;
        let percent = self._options.clip.percent;
        let clipPath = null;
        
        
        self._clone = self._target.clone();
        clipPath = self._inset(0, percent);
        console.log(clipPath);
        self._clone.attr('clip-path', clipPath);
        
        if (self._isTextNode()){
            // set same color as target
            self._clone.attr('fill', self._target.attr('fill'));
        }
        
        clipPath = self._inset(100-percent,0);
        console.log(clipPath);
        self._target.attr('clip-path', clipPath);     
        
        if (this._options.cut.docut){
            await self._drawCutLine();
        }
        
        
        return new Promise(async function(resolve, reject) {
            self._clone.animate({
                fill: self._options.clip.color
            }, dur, ease, async ()=>{
                await self._cut();
                resolve();
            });
        });
    }

    async _cut() {
        let self = this;
        let offx = self._options.slide.offsetX;
        let offy = self._options.slide.offsetY;
        
        return new Promise(async function(resolve, reject) {
            self._clone.slide(offx, -offy, self._options.slide.dur);
            self._target.slide(-offx, offy, self._options.slide.dur).then(()=>{
               resolve();
           });
        });
    }
    

    /**
    *
    */
    async _drawCutLine() {
        let self = this;
        let {x, y, w, h} = this._target.getBBox();
        let pct = self._options.clip.percent / 100;
        
        self._cutLine = this._target.paper.line(x, y + pct * h, x+w, y + pct * h);
        self._cutLine.attr('style', self._cutLineStyle());
        self._cutLine.hide();
        return new Promise(async function(resolve, reject) {
           self._cutLine.fadeIn(0);
           await Effects.vivus(self._cutLine, self._options.cut.dur);
           resolve();
        });
    }
    
    _cutLineStyle(){
        let opts = this._options.cut;
        let expr = `fill:none;stroke:${opts.color};stroke-width:${opts.width}`;
        return expr;
    }
    
    
    _inset(top, bottom) {
        return `inset(${top}% 0% ${bottom}% 0%)`;
    }
    
    
    /**
    *
    */
    _isTextNode() {
        let nodeName = this._target.type;
        return nodeName == 'text';
    }

}