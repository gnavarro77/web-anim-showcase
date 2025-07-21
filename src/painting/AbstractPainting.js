
const SVG = SvgHelper;

class AbstractPainting {

    
    _container = null;
    

    constructor(){

    }

    async _load(url){
        let self = this;
        let promise =  new Promise(async function(resolve, reject) {
             Snap.load(url,(svg)=>{
                resolve(new Snap(svg.node.firstElementChild));
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


    computeCenterY(elt){
        let containerHeight = this._container.getBBox().cy;
        //let containerHeight = this._container.node.viewBox;
        //containerHeight = this._container.asPX('height', containerHeight);
        let eltHeight = elt.getBBox().height;
        
        let y = (containerHeight - eltHeight) /2 
        
        return containerHeight;
    }

}