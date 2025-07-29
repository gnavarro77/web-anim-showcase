class Scene {
    
    
    _scene = null;
    
    
    
    constructor(){
        
    }
    
     getSceneUrl(){};
     stage(){};
    
    async initialize(){
        let self = this;
        let url = this.getSceneUrl();
        return new Promise(async function(resolve, reject) {
             Snap.load(url,async (frag)=>{
                 self._scene = new Snap(frag.node.firstElementChild);
                resolve(self._scene.node);
             });
        });       
    };
    
}