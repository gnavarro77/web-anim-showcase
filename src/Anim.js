Snap.plugin(function(Snap, Element, Paper, global) {
    
    
    
    Snap.newMatrix = function(m){
        return Snap.matrix(m.a,m.b,m.c,m.d,m.e,m.f);
    }
    
    
    Snap.asMatrixExpr = function(matrix){
    let expr = `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`;  
    return expr;
}
    
    
    
	Paper.prototype.circlePath = function(cx, cy, r) {
		var p = "M" + cx + "," + cy;
		p += "m" + -r + ",0";
		p += "a" + r + "," + r + " 0 1,0 " + (r * 2) + ",0";
		p += "a" + r + "," + r + " 0 1,0 " + -(r * 2) + ",0";
		return this.path(p, cx, cy);
	};

    
    Element.prototype._animRotate = function(angle, center, dur){
        let self = this;
        let {local, localMatrix} = this.transform();
        let expr = '';
        let currentAngle = 0;
        
        return  new Promise(async function(resolve, reject) {
            Snap.animate(0, dur, function(time){
                currentAngle = (time / dur) * angle;
                expr = local + ` r${currentAngle}, ${center.x} ${center.y}`;
                self.transform(expr);
            }, 
            dur, 
            mina.linear,
            function(){
                resolve();
                console.log('after rotation');
                SvgHelper.inpectMatrix(self);
            });
        });

    }
    
    
    
    Element.prototype._animTanslationX = function(offset, dur){
        let self = this;
        let {local, localMatrix} = this.transform();
        let startPosX = localMatrix.e;
        let expr = '';
        let val = 0;
        
        return  new Promise(async function(resolve, reject) {
            Snap.animate(0, dur, function(time){
                val = (time / dur) * offset;
                localMatrix.e = startPosX + val;
                expr = SvgHelper.matrixExpr(localMatrix);
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
    * Glisse selon l'axe x
    */
    Element.prototype.slide = function(offset, dur){
        let self = this;
        let {local, localMatrix} = self.attr('transform');
        console.log(localMatrix);
        localMatrix.e = localMatrix.e + offset;
        let expr =Snap.asMatrixExpr(localMatrix);
        let anim = self.node.animate({ transform: expr }, {
            'fill':'forwards',
            duration: dur
        });
        
        anim.finished.then(()=>{
            console.log('animation is finished');
            console.log(localMatrix);
            let m = Snap.matrix(...Object.values(localMatrix));
            self.transform(m.toTransformString());
        });
        
        return anim.finished;
    }
    
    
    

});