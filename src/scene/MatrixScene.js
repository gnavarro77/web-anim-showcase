class MatrixScene extends Scene {

    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/matrix/matrix.svg';
    }


    async stage(){
        let hulk = this._scene.select('#hulk');
        hulk.scene = this._scene;
        
        
         //hulk.slide(40, 1000);
        let {cx, cy, w, h, x, y} = hulk.getBBox();
        
        let container = document.getElementById('scene_container');
        container.onclick = (()=>{
            
           
            
            //this._scene.append(hulk.paper.pin(cx,cy));
            let anim = hulk.wheel(45, {x:cx,y:cy}, 500);
            //anim.then(()=>{
                //hulk.slide(40, 1000);
            //});
        });
        
    }
    
    
     __pt(x,y){
        //console.log({x:x,y:y});
        let pt = this._scene.circle(x,y,5);
        pt.attr('fill','red');
        return pt;
    }

}