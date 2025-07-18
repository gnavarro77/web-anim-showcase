class GoThroughAnim {

    target = null;
radius = {
    'rx':12,
    'ry':6
};
center = null;

constructor(target){
    this.target = target;
    this.center = SvgHelper.computeCenterCoords(this.target);
}


async run(){
    let self = this;
    let promise = new Promise(async function(resolve, reject) {
        await self.animate();
        resolve();
    });
    return promise;
}


async animate() {
    let ellipse = this._createEllipse();
    this.target.appendChild(ellipse);

    let animation = ellipse.animate(
        [{ 'ry': 0 }, { 'opacity': 1 }], 
        {
            duration: 200,
            easing: "ease-in-out"
        }
    );
    
    await animation.finished;
    
    animation.finished.then(() => {
        const targetRy = 2;
        SvgHelper.setAttribute(ellipse, "opacity",1);
        ellipse.animate([{ 'rx': this.radius.rx, 'rx': this.center.x, 'ry': targetRy }], 
                        {duration: 600,easing: "ease-in-out"})
            .finished.then(() => {
            SvgHelper.setAttribute(ellipse,'rx', this.center.x);
            SvgHelper.setAttribute(ellipse,'ry', targetRy);
        });
    });

    return animation.finished;
}

_createLine2(orientation = 0) {
    const line = SvgHelper.createTag('path');

    const x2 = orientation == 1?this.center.x*2:0;
    const pathExpr = `M ${this.center.x} ${this.center.y} L ${x2} ${this.center.y}`;

    console.log(pathExpr);

    const attrs = {
        'fill':'none',
        'stroke':'deeppink',
        'stroke-width' : 1,
        'pathLength':20,
        'stroke-dasharray':3,
        'stroke-dashoffset':10,
        'class' : 'goThroughAnim',
        'd':pathExpr
    };
    SvgHelper.setAttributes(line, attrs);
    this.target.appendChild(line);

    let animation = line.animate(
        [{'stroke-dashoffset':1, 'stroke-dashoffset':0 }], 
        {
            duration: 800,
            easing: "ease-in-out"
        }
    );

}


_createLine(orientation = 0) {
    const line = SvgHelper.createTag('line');
    const attrs = {
        'fill':'none',
        'x1':this.center.x,
        'y1':this.center.y,
        'x2':orientation == 1?this.center.x*2:0,
        'y2':this.center.y,
        'stroke':'deeppink',
        'pathLength':12,
        'stroke-width' : 1,
        'stroke-dashoffset':'100',
        'class' : 'goThroughAnim'
    };
    SvgHelper.setAttributes(line, attrs);

    this.target.appendChild(line);
    /*
        let animation = line.animate(
            [{ 'opacity': 0 }], 
            {
                duration: 800,
                easing: "ease-in-out"
            }
        );*/
    return line;
}

_createEllipse() {
    const ellipse = SvgHelper.createTag('ellipse');

    const attrs = {
        'cx':this.center.x ,
        'cy':this.center.y ,
        'rx':this.radius.rx,
        'ry':this.radius.ry,
        //'fill':'#ecc778',
        'class' : 'goThroughAnim',
        'opacity':0
    };

    SvgHelper.setAttributes(ellipse, attrs);
    return ellipse;
}

}