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
    Element.prototype.wheel = function(angle, center, dur=1000) {
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
    

    /**
    * Rotation autour du centre de l'object
    */
    Element.prototype.wheel2 = function(angle, dur=1000) {
        let self = this;
        let {local, localMatrix} = self.attr('transform');
        let animTransform = self.node.children[2];
        console.log(animTransform.attributes);
        animTransform.onanimationend = function(){
            console.log('ANIMATION ENDED');
        }
        let {cx, cy} = self.getBBox();
        self.append(self.paper.pin(cx,cy));
        let tm = TransformationMatrix;
        let matrix = tm.fromObject(localMatrix)
        matrix = tm.compose([matrix,tm.rotateDEG(angle, cx, cy)]);
        let expr = tm.toSVG(matrix);
        let anim = Snap.applyAnimation(self, matrix, dur);
        return anim.finished;
        return null;
    }

    

});