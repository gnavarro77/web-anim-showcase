class ValleeScene extends Scene {
    
    
    _paths = null;
    _whale = null;
    _vallee = null;
    _hulk = null;
    _airShip = null;

    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/vallee/vallee.svg';
    }


    async stage(){
        let self = this;
        this._paths = this._scene.selectAll('g').items;
        //Snap.hideAll(this._paths);
        
        this._addPlayButton().then((btn)=>{
            btn.click(async function(){
                btn.fadeOut();
                await self.run();
            });
        });

        Snap.load('svg/vallee/whale.svg',async (frag)=>{
            self._whale = new Snap(frag.node.firstElementChild);
            self._whale.attr({
                width:'4%',
                height:'4%',
                x:'28%',
                y:'10%'
            });
        });
        
        this._vallee = this._scene.select('#vallee');
        
        this._loadHulk();
        this._loadAirShip();
    }
    

    async _loadHulk() {
        let self = this;
        Snap.load('svg/vallee/hulk.svg',async (frag)=>{
            self._hulk = new Snap(frag.node.firstElementChild);
            self._scene.append(self._hulk);
            self._hulk.attr({
                width:'25%',
                height:'25%',
                x:'41%',
                y:'62%'
            });
        });
    }
    
    
    async _loadAirShip(){
        let self = this;
        Snap.load('svg/vallee/air-ship.svg',async (frag)=>{
            self._airShip = new Snap(frag.node.firstElementChild);
            self._vallee.append(self._airShip);
            self._airShip.attr({
                width:'10%',
                height:'10%',
                x:'56%',
                y:'10%'
            });
        });
    }



    async run() {
        //await this.display();
        //console.log('finished');
        //this._flyWhale();
        this._flyAirShip();
    }

    async _flyAirShip(){
        let dur = 5000;
        this._airShip.slideX(2000, dur);
        let scale = 0.5;
        this._airShip.scaleOnCenter(scale, scale, dur);
        
    }

    async _flyWhale(){
        this._vallee.append(this._whale);
        let traj = this._scene.select('#trajWhale');
        let dur = 10000;
        let anim = this._whale.animateAlongPath(traj,0,dur);
    }



    async display(){
        let paths = this._paths.filter((path) => path.node.id != 'trajectoires');;
        
        paths = paths.reverse();
        let promise = null;
        return  new Promise(async function(resolve, reject) {
            for (let i =0; i < paths.length; i++){
                promise = paths[i].fadeIn(8000);
                await Snap.sleep(200);
                if (i == paths.length-1){
                    promise.then(()=>resolve());
                }
            }
            
        });  
    }
    

}