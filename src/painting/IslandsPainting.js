class IslandsPainting extends AbstractPainting {
    
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

    
    async init(){
        let self = this;
        var promise = this._load('svg/fantasy-world-2023256.svg')
        promise.then((snap)=>{
            self._container = snap;
        });
        return promise;
    }
    
    
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
        await self._load(persoUrl).then((frag) => {
            island = Snap.select('#' + id);
            // set island on motion
            island.node.dispatchEvent(new Event('dblclick'));
            
            let perso = Snap(frag.node);
            perso.attr(pos);
            island.append(perso);
            island.node.onclick = (()=>{
                perso.animate({ opacity: 1}, 1000);
            });
        });
        return island;
    }

    
    async _loadMemo(){
        let memo = await new Memo().initialize();
        this._memo = memo.getNode();
        this.getRoot().append(this._memo);
        
        // positoning memo
        let bbox = this._container.getBBox();
        let eltBbox = this._memo.getBBox();
        this._memo.attr({
            x: (bbox.r2/2) - eltBbox.r2 +'px',
            y: (bbox.r1/2) - eltBbox.r1 + 'px',
            opacity:1
        });
    }
    
    async _hideMemo(){
        let self = this;
        this._memo.animate({opacity:0},500, mina.easeinout(), ()=>{
            self._clearMemo();
            this._memo.data('island', null);
        });
    }


    async _writeMemo(key){
        let self = this;
        let islandKey = this._memo.data('island');
        if (islandKey != key) {
            this._memo.data('island', key);
            if (this._isMemoVisible()){
                self._clearMemo();
            }
            this._memo.animate({opacity:1},500,mina.easeinout(), ()=>{
                self._writeCitation(self._citations[key]);
            });
        }
    }
    
    _clearMemo(){
        this._memo.selectAll('text').forEach((line)=>{line.remove();});
    }

    _isMemoVisible(){
        return this._memo.attr('opacity') == 1;
    }
    
    
    async _writeCitation(citation){
        let screen = this._memo.select('#screen');
        let bbox = this._memo.select('#screenBox').getBBox();
        let pos = {
            x:bbox.x,
            y:bbox.y,
            width:bbox.width
        }
        this._writeLinesSeq(citation, 0, pos);
    }
    
    async _writeLinesSeq(lines, idx, pos){
        let self = this;
        let line = await this._writeLine(lines[idx], pos);
        if (idx < lines.length -1){
            let bbox = line.node.getBBox();
            pos.y += bbox.height;
            if (idx == lines.length-2){
                pos.y += bbox.height;
                pos.width = pos.width / 2;
            }
            await this._writeLinesSeq(lines, ++idx, pos);
        }    
    }
    
    async _writeLine(content, pos){
        let self = this;
        let promise =  new Promise(async function(resolve, reject) {
            let text = self._memo.text(0, 0, content);
            const textPath = `M${pos.x}, ${pos.y} h ${pos.width}`;
            text.attr({
                textLength:0,
                opacity:0,
                textpath: textPath,
                class:'memo-text'
            });
            await text.animate({textLength:pos.width, opacity:1}, 
                         350, 
                         mina.easeinout,
                         ()=>{resolve(text);
            });    
        });
        return promise;
    }
    

    
}