class MatrixScene extends Scene {

    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/matrix/matrix.svg';
    }


    async stage(){
        let hulk = this._scene.select('#hulk');
        
        let container = document.getElementById('scene_container');
        container.onclick = (()=>{
            
            hulk.slide(40, 1000);
            
            /*
            let {cx, cy, x, y, width, height} = hulk.getBBox();
            let {local, localMatrix} = hulk.attr('transform');
            console.log(localMatrix);

            let pivot = {
                x : 200,
                y : 100
            };
            console.log(localMatrix.toTransformString());
            
            localMatrix.e -= 20;
            
            let expr = null;
            expr =Snap.asMatrixExpr(localMatrix);
            
            hulk.animate({ transform: expr }, 1000, mina.linear,
                function(){
                    console.log(localMatrix);
                });
                */
        });
        
    }
    
    
     __pt(x,y){
        //console.log({x:x,y:y});
        let pt = this._scene.circle(x,y,5);
        pt.attr('fill','red');
        return pt;
    }

}