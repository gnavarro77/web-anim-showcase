Snap.plugin(function(Snap, Element, Paper, global) {



    Snap.newMatrix = function(m){
        return Snap.matrix(m.a,m.b,m.c,m.d,m.e,m.f);
    }


    Snap.asMatrixExpr = function(matrix){
        let expr = `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`;  
        return expr;
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


    /**
    * Glisse selon l'axe x
    */
    Element.prototype.slide = function(offset, dur = 1000){
        let self = this;
        let {local, localMatrix} = self.attr('transform');
        localMatrix.e = localMatrix.e + offset;
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
        /*
        let self = this;
        return  new Promise(async function(resolve, reject) {
            self.animate({opacity:1}, dur, ease,()=>{
                resolve();
            });
        });    */
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
        
        //let split = localMatrix.split();
        
        let {cx, cy} = self.getBBox();
        self.append(self.paper.pin(cx,cy));
        
        let tm = TransformationMatrix;
        
        let matrix = tm.fromObject(localMatrix)
        matrix = tm.compose([matrix,tm.rotateDEG(angle, cx, cy)]);
        let expr = tm.toSVG(matrix);
        let anim = Snap.applyAnimation(self, matrix, dur);
        return anim.finished;
        
        /*
        let self = this;
        //self.node.transform(`rotate(${angle})`);
        let expr = `rotate(${angle}deg)`;
        self.node.style.transform = expr;

        let {local, localMatrix} = self.attr('transform');
        //let anim = Snap.applyAnimation(self, localMatrix, dur);
        return anim.finished;
        */
        return null;
    }


    Snap.applyAnimation = function(elt, matrix, dur){
        let expr =Snap.asMatrixExpr(matrix);
        console.log(expr);
        let anim = elt.node.animate({ transform: expr }, {
            'fill':'forwards',
            duration: dur
        });
        anim.finished.then(()=>{
            console.log('animation is finished');
            ////console.log(matrix);
            //let m = Snap.matrix(...Object.values(matrix));
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
    

});