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
    

    _addPlayButton(){
        let self = this;
        return new Promise(async function(resolve, reject) {
             Snap.load('svg/play.svg',async (frag)=>{
                 let btn = new Snap(frag.node.firstElementChild);
                 
                 btn.attr({
                     x: '2%',
                     y: '2%',
                     width:'10%',
                     height:'10%'
                 });
                 
                 self._scene.append(btn);
                 resolve(btn);
             });
        }); 
    }
    



    transformFromViewportToElement(x, y, sctm=null, elementTransform=null) {
        // Transforms coordinates from the client (viewport) coordinate
        // system to coordinates in the SVG element's coordinate system.
        // Call this, for example, with clientX and clientY from mouse event.

        // create a new DOM point based on coordinates from client viewport
        const p = new DOMPoint(x, y);

        // get the transform matrix used to convert from the SVG element's
        // coordinates to the screen/viewport coordinate system
        let screenTransform;
        if (sctm === null) {
            screenTransform = document.getElementById('main').getScreenCTM();
        } else {
            screenTransform = sctm;
        }

        // now invert it, so we can transform from screen/viewport to element
        const inverseScreenTransform = screenTransform.inverse()

        // transform the point using the inverted matrix
        const transformedPoint = p.matrixTransform(inverseScreenTransform)

        // adjust the point for the currently applied scale on the element
        if (elementTransform !== null) {
            transformedPoint.x *= elementTransform.a; // scale x
            transformedPoint.y *= elementTransform.d; // scale y
        }

        return {x: transformedPoint.x, y: transformedPoint.y}
    }


}