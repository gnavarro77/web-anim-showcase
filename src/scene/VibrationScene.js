class VibrationScene extends Scene {
    
    
    _paths = null;
    
    
    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/vibration/vibration.svg';
    }


    async stage(){
        const self = this;
        this._paths = this._scene.selectAll('path').items;
        
        
        
        this._addPlayButton().then((btn)=>{
            btn.click(async function(){
                new VibrationEffect(self._paths[1],{duration : 400, offset:20}).run();    
                new VibrationEffect(self._paths[0],{duration : 400, offset:20, orientation:'vertical'}).run();    
                
            });
        });
        
        
        
        
        
        
    }



}