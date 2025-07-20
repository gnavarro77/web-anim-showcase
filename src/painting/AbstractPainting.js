
const SVG = SvgHelper;

class AbstractPainting {

    
    _container = null;
    

    constructor(){

    }

    async _load(url){
        let self = this;
        let promise =  new Promise(async function(resolve, reject) {
             Snap.load(url,(svg)=>{
                 self._container = new Snap(svg.node);
                resolve(svg);
             });
        });    
        return promise;
    }

    getContainer(){
        return this._container;
    }

    getRoot(){
        return Snap.select('#root');
    }
}