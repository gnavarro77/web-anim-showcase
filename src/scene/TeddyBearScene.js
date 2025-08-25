class TeddyBearScene extends Scene {
    
    _base = null;
    _true = null;
    _false = null;
    
     constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/validation/teddy-bear.svg';
    }


    async stage(){
        let self = this;
        ['base', 'true', 'false'].forEach((name) => {
            self['_' + name] = self._scene.select('#' + name);
        });
        
        self._true.fadeOut(0);
        self._false.fadeOut(0);
        
        let btn =self._scene.select('#btnTrue');
        btn.addClass('clickable');
        btn.click(()=>self.doTrue());
        
        btn =self._scene.select('#btnFalse');
        btn.addClass('clickable');
        btn.click(()=>self.doFalse());
        
    }
    
    
    async run() {
    }
    
    
    async doTrue(){
        this._true.fadeIn(0);
        await this._base.clipOutFromBottom();
        await Snap.sleep(2000);
        await this._base.clipInFromBottom();
        this._true.fadeOut(0);
    }
    
    async doFalse(){
        this._false.fadeIn(0);
        await this._base.clipOutFromBottom();
        await Snap.sleep(2000);
        await this._base.clipInFromBottom();
        this._false.fadeOut(0);
    }

    
}