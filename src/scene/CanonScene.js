class CanonScene extends Scene {

    _canon = null;
    _tube = null;
    _roues = [];
    _explosion = null;
    _trajectoires = null;
    _trajectoireContainer = null;
    
    _firePos = {x:0, y:0};

    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/canon/canon.svg';
    }


    async stage(){
        let self = this;
        this._canon = this._scene.select('#canon');
        let {x,y,w,h} = this._canon.getBBox();
        this._firePos = {
            x : x + w,
            y : y
        };
        
        ['#roue1','#roue2'].forEach((id) => {
            self._roues.push(self._canon.select(id));
        });
        this._tube = this._scene.select('#tube');
        this._explosion = this._scene.select('#explosion');
        this._explosion.hide();
        
        this._trajectoireContainer = this._scene.select('#trajectoires');
        this._trajectoires = this._trajectoireContainer.selectAll('path');

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
        let dur = 200;
        let promise = self._mvtCanon(0,dur);
        self._explosion.fadeIn(dur);
        self._fireLetter().then((text)=>{
            
            //let {x,y} = text.getBBox();
            let {localMatrix} = text.attr('transform');
            
            let clone = text.clone();
            
            text.attr({ 'textpath': '' });
            let self = this;
            console.log('sdkjfgmqszg');
        });
        //Snap.sleep(dur);
        promise.then(()=>{
            self._explosion.fadeOut(dur * 2);
            self._mvtCanon(1,dur);
        });
    }


    _fireLetter(letter = 'A') {
        let self = this;
        let path = this._trajectoires.items[Math.floor(Math.random()*this._trajectoires.items.length)];
        let length = path.getTotalLength();
        console.log('length : ' + length);
        let {x,y} = path.getBBox();
        
        path = path.attr('d');

        let text = this._trajectoireContainer.text(x,y,letter);
        text.attr({ 'textpath': path });
        text.textPath.attr({ 'startOffset': -(0.5 * length)});
        let coeff = (length < 150)?0.2:0.4;
        
        return  new Promise(async function(resolve, reject) {
            let anim = text.textPath.animate({ 'startOffset': coeff * length }, 500, function(){
                resolve(text);
            } );
        });  
    }
    

    _mvtCanon(recul = 0, dur=1000) {
        let self = this;
        let offset = (recul == 0)? -10:10;
        let angle = (recul == 0)? -45:45;
        let angleCanon = (recul == 0)? -3:3;
        
        
        let promise = self._canon.slide(offset, dur);
        self._wheel(self._roues[0], angle, dur);
        self._wheel(self._roues[1], angle, dur);
        let {cx, cy} = self._tube.getBBox();
        self._tube.wheel(angleCanon, {x:cx,y:cy}, dur);
        return  promise;
    }
    

    _wheel(wheel = null, angle = 0, dur=1000){
        let {cx, cy} = wheel.getBBox();
        return wheel.wheel(angle, {x:cx,y:cy}, dur);
    }
        

}