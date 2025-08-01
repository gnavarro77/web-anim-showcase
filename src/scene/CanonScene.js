class CanonScene extends Scene {

    _canon = null;
    _roues = [];

    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/canon/canon.svg';
    }


    async stage(){
        let self = this;
        this._canon = this._scene.select('#canon');
        ['#roue1','#roue2'].forEach((id) => {
            self._roues.push(self._canon.select(id));
        });

        let test = document.getElementById('scene_container');
        test.onclick = (()=>{
            this._fire();
        });
    }


    /**
        *
        */
    _fire(){
        let self = this;
        this._mouvementRecul();
    }
    

    _mouvementRecul() {
        let self = this;
        let localMatrix = this._canon.attr('transform').localMatrix;
        let e = localMatrix.e;
        let dur = 80;
        let offset = -10;
        let expr = null;
        let val = 0;
        
        let {cx, cy} = this._canon.getBBox();
        
        this._canon.animate({ transform: 's1.3274891r45,'+cx+','+cy }, 1000, mina.linear ) 
        //this._canon._animTanslationX(offset, dur);
        //self._wheelAnim(self._roues[0], -40, dur);
        //self._wheelAnim(self._roues[1], -40, dur);
    }
    

    _wheelAnim(wheel, angle, dur = 1000) {
        SvgHelper.inpectMatrix(wheel);
        let {cx, cy} = wheel.getBBox();
        let {local, localMatrix} = wheel.transform();
        let x = cx - localMatrix.e; 
        let y = cy - localMatrix.f;
        wheel._animRotate(-40,{x,y}, dur);
    }

    
    __pt(x,y){
        
        console.log('point');
        console.log({x:x,y:y});
        
        let pt = this._scene.circle(x,y,2);
        pt.attr('fill','red');
        return pt;
    }

        

}