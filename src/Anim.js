Snap.plugin(function(Snap, Element, Paper, global) {



    Snap.newMatrix = function(m){
        return Snap.matrix(m.a,m.b,m.c,m.d,m.e,m.f);
    }


    Snap.asMatrixExpr = function(matrix){
        let expr = `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`;  
        return expr;
    }

    Snap.hideAll = function(elements){
        elements.forEach((element) => {
            element.hide();
        });
    }

    Snap.removeAll = function(elements){
        elements.forEach((element) => {
            element.remove();
        });
    }

    Snap.applyAnimation = function(elt, matrix, dur){
        let expr =Snap.asMatrixExpr(matrix);
        console.log(expr);
        let anim = elt.node.animate({ transform: expr }, {
            'fill':'forwards',
            duration: dur
        });
        anim.finished.then(()=>{
            elt.transform(expr);
        });

        return anim;
    }

    Snap.sleep = function(dur=1000) {
        return  new Promise(async function(resolve, reject) {
            setTimeout(() => {
                resolve();
            }, dur);
        });
    }


    Paper.prototype.pin = function(x, y, radius = 5){
        let pt = this.circle(x,y, radius);
        pt.attr('fill','red');
        return pt;
    }


    Paper.prototype.circlePath = function(cx, cy, r) {
        var p = "M" + cx + "," + cy;
        p += "m" + -r + ",0";
        p += "a" + r + "," + r + " 0 1,0 " + (r * 2) + ",0";
        p += "a" + r + "," + r + " 0 1,0 " + -(r * 2) + ",0";
        return this.path(p, cx, cy);
    };


    Paper.prototype.line = function(x1, y1, x2, y2){
        let expr = `M${x1} ${y1} L${x2} ${y2}`;
        return this.path(expr);
    }

    /*
    */
    Element.prototype.clipOut = function(dur = 1000, from = 'top'){
        let self = this;
        let {x, y, w, h} = this.getBBox();
        let top = 0;
        let bottom = 0;
        
        return  new Promise(async function(resolve, reject) {
            Snap.animate(0, dur, function(time){
                    if (from == 'top'){
                        top = ((time /dur) * 100).toFixed(0);
                    } else {
                        bottom = ((time /dur) * 100).toFixed(0);
                    }
                    inset = `inset(${top}% 0% ${bottom}% 0%)`;
                    self.attr('clip-path', inset);
                }, 
                dur, 
                mina.linear,
                ()=>{resolve()}
            );
        });
    }
    
    Element.prototype.clipOutFromTop = function(dur=1000){
        return this.clip(0,100, dur, function(val){ return `inset(${100 - val}% 0% 0% 0%)`;});
    }
    
    Element.prototype.clipOutFromBottom = function(dur=1000){
        return this.clip(0,100, dur, function(val){ return `inset(0% 0% ${100 - val}% 0%)`;});
    }
    
    Element.prototype.clipInFromBottom = function(dur=1000){
        return this.clip(0,100, dur, function(val){ return `inset(${val}% 0% 0% 0%)`;});
    }
    
    Element.prototype.clipInFromTop = function(dur=1000){
        return this.clip(0,100, dur, function(val){ return `inset(${100-val}% 0% 0% 0%)`;});
    }
    
    Element.prototype.clip = function(from=0, to=100, dur = 1000, valueResolver = function(value, from) {return `inset(${val}% 0% ${from}% 0%)`;}){
        let self = this;
        let val = from;
        let range = Math.abs(to-from);
        
        return  new Promise(async function(resolve, reject) {
            Snap.animate(0, dur, function(time){
                    val = 100 - (from + Number(((time /dur) * range).toFixed(0)));
                    //inset = `inset(${val}% 0% ${from}% 0%)`;
                    let inset = valueResolver(val,from);
                    self.attr('clip-path', inset);
                }, 
                dur, 
                mina.linear,
                ()=>{resolve()}
            );
        });
    }    
    
    
    
    Element.prototype.centerOnPoint = function(pt){
        let {cx, cy} = this.getBBox();
        let tm = TransformationMatrix;
        let {localMatrix} = this.transform();

        let x = (cx > pt.x) ? pt.x - cx : Math.abs(cx - pt.x);
        let y = (cy > pt.y) ? pt.y - cy : Math.abs(cy - pt.y);

        let matrix = tm.transform([
            tm.translate(x, y),
            localMatrix
        ]);
        let str = tm.toSVG(matrix);
        console.log('center : ' + str);
        this.transform(str);
    }



    Element.prototype.animateAlongPath = function(path, start = 0, dur = 1000){
        let self = this;
        let len = Snap.path.getTotalLength( path );
        let anim = Snap.animate( start, len, function( value ) {
            var movePoint = Snap.path.getPointAtLength( path, value );
            self.attr({ x: movePoint.x, y: movePoint.y });
            self.data('movePoint', movePoint);
            console.log(movePoint);
        }, dur);
        return anim;
    }




    /**
    * Glisse selon l'axe x,y (definition par offset)
    */
    Element.prototype.slide = function(offsetX, offsetY, dur = 1000){
        let self = this;
        let {localMatrix} = self.attr('transform');
        localMatrix.e = localMatrix.e + offsetX;
        localMatrix.f = localMatrix.f + offsetY;
        let anim = Snap.applyAnimation(self, localMatrix, dur);
        return anim.finished;
    }

    /**
    * Glisse selon l'axe x
    */
    Element.prototype.slideX = function(offset, dur = 1000){
        return this.slide(offset, 0, dur);
    }

    /**
    * Glisse selon l'axe y
    */
    Element.prototype.slideY = function(offset, dur = 1000){
        return this.slide(0, offset, dur);
    }


    /**
    *
    */
    Element.prototype.scaleY = function(sy, from = 'top',  dur=1000, ease = mina.linear) {
        let self = this;
        let tm = TransformationMatrix;
        let {localMatrix} = self.attr('transform');
        let bbox = self.getBBox();
        let cx = bbox.x;
        let cy = (from == 'top') ? bbox.y : bbox.y+bbox.h;
        let csy = 1;
        return  new Promise(async function(resolve, reject) {
            let expr = null;
            Snap.animate(0, dur, function(time){
                csy = localMatrix.d + (time/dur) * (sy - localMatrix.d);
                matrix = tm.transform([
                    tm.scale(localMatrix.a,csy, cx, cy),
                    localMatrix
                ]);
                self.transform(tm.toSVG(matrix));
            }, 
                         dur, 
                         ease,
                         function(){
                resolve();
            });

        });

    }


    Element.prototype.scaleOnCenter = function(sx,sy,dur=1000, ease = mina.linear){
        let self = this;
        let {cx, cy} = this.getBBox();
        let center = {x:cx, y:cy};

        console.log(center)
        
        let tm = TransformationMatrix;
        let {localMatrix} = self.transform();
        let csx = 0;
        let csy = 0;
        
        return  new Promise(async function(resolve, reject) {
            Snap.animate(0, dur, function(time){
                
                
                csx = 1 + ((time/dur) * (sx-1));
                csy = 1 + ((time/dur) * (sy-1));
                
                //console.log(`scale(${csx},${csy})`);
                
                let matrix = tm.transform([
                    localMatrix,
                    tm.scale(csx,csy)
                ]);
                let str = tm.toSVG(matrix);
                self.transform(str);
                self.centerOnPoint(center);
                    
            }, dur, ease, ()=>resolve());
        });
    }

    /**
    *
    */
    Element.prototype.scale = function(sx, sy, dur=1000, ease = mina.linear) {
        let self = this;
        let tm = TransformationMatrix;
        let {localMatrix} = self.attr('transform');
        let csx = 1;
        let csy = 1;

        return  new Promise(async function(resolve, reject) {
            let expr = null;
            Snap.animate(0, dur, function(time){
                csx = localMatrix.a + (time/dur) * (sx - localMatrix.a);
                csy = localMatrix.d + (time/dur) * (sy - localMatrix.d);
                matrix = tm.transform([
                    tm.scale(csx,csy),
                    localMatrix
                ]);
                self.transform(tm.toSVG(matrix));
            }, 
                         dur, 
                         ease,
                         function(){
                resolve();
            });

        });

    }


    Element.prototype.translateTo = function(pt, dur = 1000) {
        let self = this;
        let bbox = self.getBBox();
        let {localMatrix} = self.attr('transform');
        localMatrix.e += (pt.x < bbox.x)?-(bbox.x-pt.x) : pt.x-bbox.x;
        localMatrix.f += (pt.y < bbox.y)?-(bbox.y-pt.y) : pt.y-bbox.y;
        let anim = Snap.applyAnimation(self, localMatrix, dur);
        return anim.finished;
    }


    /**
    *
    */
    Element.prototype.wheel = function(angle, dur=1000) {
        let self = this;
        let {localMatrix, globalMatrix, totalMatrix} = self.attr('transform'); 
        let matrix = null;
        let tm = TransformationMatrix;

        let {cx, cy, w,h,x,y} = this.getBBox();

        return  new Promise(async function(resolve, reject) {
            let currentAngle = 0;
            let expr = null;
            Snap.animate(0, dur, function(time){
                currentAngle = (time / dur) * angle;
                matrix = tm.transform([
                    tm.rotateDEG(currentAngle, cx, cy),
                    localMatrix
                ]);
                expr = tm.toSVG(matrix);
                //console.log(expr);
                self.transform(expr);
            }, 
                         dur, 
                         mina.linear,
                         function(){
                resolve();
            });

        });
    }
    
    /*
    */
    Element.prototype.rotateOnPoint = function(angle, point, dur=1000) {
        let self = this;
        let {localMatrix} = self.attr('transform');
        let matrix = null;
        let tm = TransformationMatrix;
        let {cx, cy, w,h,x,y} = this.getBBox();
        return  new Promise(async function(resolve, reject) {
            let currentAngle = 0;
            let expr = null;
            Snap.animate(0, dur, function(time){
                currentAngle = (time / dur) * angle;
                matrix = tm.transform([
                    tm.rotateDEG(currentAngle, point.x, point.y),
                    localMatrix
                ]);
                expr = tm.toSVG(matrix);
                self.transform(expr);
            }, dur, mina.linear,()=>resolve());

        });
    }
    
    
    
    
    Element.prototype.translateRelatively = function(x, y, dur = 1000, ease= mina.linear){
        let self = this;
        return  new Promise(async function(resolve, reject) {
            self.animate({transform : `t${x},${y}`}, dur, ease, ()=>resolve());
        });
    }
    

    /**
    *
    */
    Element.prototype.hide = function(){
        this.attr('opacity',0);
    }


    /**
    *
    */
    Element.prototype.fadeIn = function(dur=1000, ease= mina.easeinout){
        return this.fade(1, dur, ease);
    }    

    /**
    *
    */
    Element.prototype.fadeOut = function(dur=1000, ease= mina.easeinout){
        return this.fade(0, dur, ease);    
    }

    /**
    *
    */
    Element.prototype.fade = function(opacity, dur=1000, ease= mina.easeinout){
        let self = this;
        return  new Promise(async function(resolve, reject) {
            self.animate({opacity:opacity}, dur, ease,()=>{
                resolve();
            });
        });    
    }

    /**
    *
    */
    Element.prototype.reversePath = function() {
        let pathString = this.attr('d');
        /*
        let absolutePath = Snap.path.toAbsolute( Snap.parsePathString( pathString ) );
        let reversedPath = absolutePath.reverse();
        */
        let expr = SmartSVGPath.reverse(pathString);
        this.attr('d', expr);
    }


});