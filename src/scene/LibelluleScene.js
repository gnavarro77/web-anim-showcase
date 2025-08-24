class LibelluleScene extends Scene {
    
    
    _libellule = null;
    _pupilleG = null;
    _pupilleD = null;
    _ailes = [];
    _corps = null;
    _rotationPoints = [];
    

    
    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/libellule/vector-2516150.svg';
    }


    async stage(){
        let self = this;
        this._libellule = this._scene.select('#libellule');
        this._pupilleD = this._libellule.select('#pupille_d');
        this._pupilleG = this._libellule.select('#pupille_g');
        this._corps = this._scene.select('#corps');        
        
        [1,2,3,4].forEach((idx)=>{
            self._ailes[idx] = self._libellule.select('#aile' + idx);
            self._rotationPoints[idx] = self._getRotationPoint(idx);
        });
        
        // pt rotation du corps
        let {cx, cy} = this._scene.select('#ctrlPtCorps').getBBox();
        self._rotationPoints[5] = {x:cx, y:cy};
        
        
        this._addPlayButton().then((btn)=>{
            btn.click(async function(){
                //btn.fadeOut();
                await self.run();
            });
        });

    }


    async run(){
        this.oeilDroit();
        await this.oeilGauche();
        this.aile(1, -25);
        this.aile(2, -18);
        this.aile(4, 30);
        this.aile(3, 18);
        this.corps(5);
    }
    
    async aile(idx, angle) {
        let pt = this._rotationPoints[idx];
        await this._ailes[idx].rotateOnPoint(angle, pt, 1000);
        this.aile(idx, -angle);
    }

    async corps(angle) {
        await this._corps.rotateOnPoint(angle, this._rotationPoints[5], 1000);
        this.corps(-angle);
    }
    
    _getRotationPoint(idx) {
        let {cx, cy} = this._scene.select('#ctrlPtAile' + idx).getBBox();
        return {x:cx, y:cy};
    }



    async oeilDroit(dur = 500) {
        let e = this._pupilleD;
        await e.translateRelatively(60, 80, dur);
        await e.wheel(45, dur/2);
        await e.scaleOnCenter(2,2, dur);
        await Snap.sleep(dur *2);
        await e.scaleOnCenter(0.5,0.5, dur);
    }

    async oeilGauche(dur = 500) {
        let e = this._pupilleG;
        await e.translateRelatively(40, 60, dur);
        await e.wheel(45, dur);
        await e.scaleOnCenter(1.5,1.5, dur);
        await Snap.sleep(dur *2);
        await e.scaleOnCenter(0.75,0.75, dur);
    }

    
}