class PerpendiculaireScene extends Scene {

    _m1 = null;
    _m2 = null;

    constructor(){
        super();
    }

    
    getSceneUrl(){
        return 'svg/geometrie/angle90.svg';
    }
    
    stage(){
        this._registerMethode1();
        this._registerMethode2();
        
        this._setupButton('#m1_play', '_runMethode1');
        this._setupButton('#m2_play', '_runMethode2');
        
    }
    

    async _runMethode1(btn){
        let m = this._m1;
        if (m.played){
            await this._clear(m);
        }
        Effects.fadeOut(btn);
        Effects.vivus(m.dessin['droiteh']);
        await Effects.fadeIn(m.instructions[0]);
        await Effects.fadeIn(m.dessin['pt1']);
        await Effects.sleep(2000);
        await Effects.fadeIn(m.instructions[1]);
        await Effects.sleep(3000);
        await Effects.vivus(m.dessin['compas'], 2000);
        await Effects.fadeIn(m.dessin['pt2']);
        await Effects.fadeIn(m.dessin['pt3']);
        await Effects.fadeIn(m.instructions[2]);
        await Effects.sleep(4000);
        await Effects.vivus(m.dessin['arc1']);
        await Effects.vivus(m.dessin['arc2']);
        await Effects.fadeIn(m.dessin['pt4']);
        await Effects.fadeIn(m.instructions[3]);
        await Effects.sleep(4000);
        await Effects.vivus(m.dessin['perpendiculaire']);
        Effects.fadeIn(btn);
        m.played = true;
    }

    async _runMethode2(btn){
        let m = this._m2;
        if (m.played){
            await this._clear(m);
        }
        Effects.fadeOut(btn); 
        Effects.vivus(m.dessin['droiteh']);
        await Effects.fadeIn(m.instructions[0]);
        await Effects.fadeIn(m.dessin['pt1']);
        await Effects.fadeIn(m.instructions[1]);
        await Effects.sleep(3000);
        await Effects.vivus(m.dessin['cercle1']);
        await Effects.fadeIn(m.dessin['pt2']);
        await Effects.sleep(3000);
        await Effects.fadeIn(m.instructions[2]);
        await Effects.sleep(2000);
        await Effects.vivus(m.dessin['cercle2']);
        await Effects.fadeIn(m.dessin['pt3']);
        await Effects.fadeIn(m.instructions[3]);
        await Effects.sleep(3000);
        await Effects.vivus(m.dessin['cercle3']);
        await Effects.sleep(5000);        
        await Effects.fadeIn(m.instructions[4]);
        await Effects.sleep(5000);
        await Effects.vivus(m.dessin['droiteIntersec']);
        await Effects.fadeIn(m.dessin['pt4']);
        await Effects.fadeIn(m.instructions[5]);
        await Effects.sleep(3000);
        Effects.vivus(m.dessin['perpendiculaire']);
        Effects.fadeIn(btn);
        m.played = true;
    }

    async _clear(methode){
        Effects.fadeOut(methode.instructions);
        await Effects.fadeOut(Object.values(methode.dessin));
    }

    /**
    *
    */
    _registerMethode1(){
        let keys = ['droiteh','compas','arc1', 'arc2','perpendiculaire','pt4','pt3','pt2','pt1'];
         this._registerMethode(1, keys);
    }
    
    _registerMethode2(){
        let keys = ['perpendiculaire','droiteIntersec','droiteh','cercle2','cercle1','cercle3','pt1','pt2','pt3','pt4'];
        this._registerMethode(2, keys);
     }

    _registerMethode(idx, keys){
        let self = this;
        return  new Promise(async function(resolve, reject) {
             self[`_m${idx}`] = {
                instructions : self._selectInstructions(`#m${idx}_instructions`),
                 dessin : {}
             };
             self._registerDrawing(`#m${idx}_dessin`, keys, self[`_m${idx}`].dessin);
            resolve();
        });
        
        
    }

    _registerDrawing(id, keys, dessin){
        let elts = this._scene.select(id).selectAll('*').items;
        elts.forEach((elt, idx) => {
            dessin[keys[idx]] = elt;
            Effects.fadeOut(elt,0);
        });
    }

    
    _setupButton(id, fname){
        let self = this;
        let btn = this._scene.select(id);
        btn.addClass('icon-button');
        btn.click(()=>{
            self[fname](btn);
        })
    }
    
    _selectInstructions(containerId) {
        let instructions =  this._scene.select(containerId).selectAll('text').items;
        Effects.fadeOut(instructions, 0);
        return instructions;
    }

}