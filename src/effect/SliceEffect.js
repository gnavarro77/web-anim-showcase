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
            color : 'white',
            opacity : 0.8,
            width : 1,
            gap : 2,
            dur : 500
        },
        slide : {
            dur : 500
        }
    };
    
    
    constructor(elt, options = {}){
        this._target = elt;
        Object.assign(this._options, options);
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
        
        
        self._clone.attr('fill', self._options.clip.color);
        
        
        //self._drawCutLine();
        await Snap.sleep(2000);
        
        return new Promise(async function(resolve, reject) {
            self._clone.animate({
                fill: self._options.clip.color
            }, dur, ease, async ()=>{
                await self._cut();
                //self._cutLine.reversePath();
                //Effects.vivus(self._cutLine, self._options.cut.dur);
                resolve();
            });
        });
    }

    async _cut() {
        let self = this;
        return new Promise(async function(resolve, reject) {
           self._clone.slide(self._getGap(), -self._getGap(), self._options.slide.dur);
           /*
            self._target.slide(-self._getGap(), self._getGap(), self._options.slide.dur).then(()=>{
               resolve();
           });*/
        });
    }
    

    /**
    *
    */
    async _drawCutLine() {
        let self = this;
        let {x, y, w, h} = this._target.getBBox();
        self._cutLine = this._target.paper.line(x, y+h/2, x+w, y+h/2);
        self._cutLine.attr({
            fill: "none",
            stroke: self._options.cut.color,
            strokeWidth: self._options.cut.width,
            opacity : self._options.cut.opacity
        });
        self._cutLine.hide();
        
        return new Promise(async function(resolve, reject) {
           self._cutLine.fadeIn(0);
           await Effects.vivus(self._cutLine, self._options.cut.dur);
            resolve();
        });
        
    }

    _getGap() {
        return this._options.cut.gap;
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