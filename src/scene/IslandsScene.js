class IslandsScene extends Scene  {
    
    
    _memoObj = null;
    _memo = null;
    
    _citations = {
        'suntzu' : ['C\'est lorsqu\'on est',
                    'environné de tous',
                    'les dangers',
                    'qu\'il n\'en faut',
                    'redouter aucun',
                    'Sun Tzu'],
        'explorer': ['Je n’ai pas peur de l’obscurité.',
                    'La vraie mort est préférable',
                    ' à une vie sans vivre.',
                    'Vasco de Gama'],
        'farmer':['Pour que les arbres et les plantes',
                  's\'épanouissent,',
                  'pour que les animaux', 
                  'qui s\'en nourrissent',
                  'prospèrent,',
                  'pour que les hommes vivent,',
                  'il faut que la terre soit',
                  'honorée.',
                  'Pierre Rabhi'],
        'elephant':['Il n’y a aucune créature',
                    'parmi toutes les bêtes du monde', 
                    'qui ait une démonstration',
                    'aussi grande et aussi ample',
                    ' de la puissance et de la sagesse',
                    'de Dieu Tout-Puissant',
                    ' que l’éléphant.',
                  'Edward Topsell']
    }

    _islands = {
        'ilecascade' : {
            perso :'svg/warrior-5658627.svg',
            pos : {
                x:'212px',
                y:'20px',
                height:'80px',
                opacity:0
            },
            citationKey : 'suntzu'
        },
        'ilemontages' : {
            perso : 'svg/to-explore-4824408.svg',
            pos : {
                x:'120px',
                y:'20px',
                height:'50px',
                opacity:0
            },
            citationKey : 'explorer'
        },
        'ilecollines' : {
            perso : 'svg/man-4423726.svg',
            pos : {
                x:'20px',
                y:'30px',
                height:'40px',
                opacity:0
            },
            citationKey : 'farmer'
        },
        'ileville' : {
            perso : 'svg/elephant-4209931.svg',
            pos : {
                x:'-20px',
                y:'105px',
                height:'30px',
                opacity:0
            },
            citationKey : 'elephant'
        }
    };
    
    
    
    constructor() {
        super();
    }

    getSceneUrl(){
        return 'svg/iles/fantasy-world-2023256.svg';
    }
    

    /*
    async initialize(){
        let self = this;
        let url = 'svg/iles/fantasy-world-2023256.svg';
        let promise =  new Promise(async function(resolve, reject) {
             Snap.load(url,async (frag)=>{
                 self._container = new Snap(frag.node.firstElementChild);
                resolve(self._container.node);
             });
        });    
        return promise;
    }*/

    async stage(){
        let self = this;
        self._loadMemo();
        for (const [key, value] of Object.entries(self._islands)) {
            console.log(`${key}`);
            let island = await self._setupIsland(key,value.perso,value.pos);
            let fn = island.node.onclick;
            island.node.onclick = (()=>{
                fn();
                self._writeMemo(value.citationKey);
            });
        }
    }
    
/**
*
*/
    async _setupIsland(id, persoUrl, pos){
        let self = this;
        let island = null;        
        let promise = new Promise(async function(resolve, reject) {
             Snap.load(persoUrl,(frag)=>{
                 island = Snap.select('#' + id);
                // set island on motion
                island.node.dispatchEvent(new Event('dblclick'));

                let perso = new Snap(frag.node.firstElementChild);
                perso.attr(pos);
                island.append(perso);
                island.node.onclick = (()=>{
                    perso.animate({ opacity: 1}, 1000);
                });
                 resolve();
             });
        });  
        await promise;
        
        return island;
    }

    
    async _loadMemo(){
        this._memoObj = await new Memo().initialize();
        this._memo = this._memoObj.getNode();
        this._scene.select('#root').append(this._memo);
        
        // positoning memo
        let bbox = this._scene.getBBox();
        let eltBbox = this._memo.getBBox();
        this._memo.attr({
            x: (bbox.r2/2) - eltBbox.r2 +'px',
            y: (bbox.r1/2) - eltBbox.r1 + 'px',
            opacity:0
        });
    }


    async _writeMemo(key){
        this._memoObj.writeLines(this._citations[key]);
    }
    
  
    

    
}