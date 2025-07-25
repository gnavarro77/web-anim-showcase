class BarScene {
    
    _snap = null;
    
    constructor(){
        
    }
    
    
    
        
    async initialize(){
        let self = this;
        let url = 'svg/bar/bar.svg';
        let promise =  new Promise(async function(resolve, reject) {
             Snap.load(url,async (frag)=>{
                 self._snap = new Snap(frag.node.firstElementChild);
                resolve(self._snap.node);
             });
        });    
        return promise;
    }
    
    
    
}