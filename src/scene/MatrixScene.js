class MatrixScene extends Scene {
    
    
    _hulk = null;
    
    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/matrix/matrix.svg';
    }


    async stage(){
        let self = this;
        this._hulk = this._scene.select('#hulk');
        
//        let {cx,cy} = this._hulk.getBBox();
//        this._scene.paper.pin(cx,cy);
        
        
        
        this._addPlayButton().then((btn)=>{
            btn.click(async function(){
//                btn.fadeOut();
                await self.run();
            });
        });
        
    }
    
    
    async run(){
        let scale = 0.8;
        this._hulk.scaleOnCenter(scale,scale,1000);
        
    }


    _encadre(elt) {
        let {x,y, w, h, cx, cy} = elt.getBBox();
        this._scene.paper.pin(cx,cy, 2);
        
        let rect = this._scene.paper.rect(x, y, w, h).attr(
            { stroke: '#123456', 'strokeWidth': 1, fill: 'none'}
        );
        
        
        
    }

    
}