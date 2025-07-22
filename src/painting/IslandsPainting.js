class IslandsPainting extends AbstractPainting {
    
    _memo = null;
    
    _citations = {
        'suntzu' : ['C\'est lorsqu\'on est',
                    'environné de tous',
                    'les dangers',
                    'qu\'il n\'en faut',
                    'redouter aucun',
                    'Sun Tzu']
    }
    
    
    
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
        let url = 'svg/warrior-5658627.svg';
        
        self._load(url).then(async (frag) => {
            self._loadMemo();
            let island = await self._setupIsland('ilecascade','svg/warrior-5658627.svg',
                                {
                                    x:'212px',
                                    y:'20px',
                                    height:'80px',
                                    opacity:0
                                });
            let fn = island.node.onclick; 
            island.node.onclick = (()=>{
                fn();
                self._writeMemo('suntzu');
            });
        });
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
            Snap(perso.node).attr({
                x:pos.x,
                y:pos.y,
                height:pos.height,
                opacity:0
            });
            island.append(perso);
            island.node.onclick = (()=>{
                perso.animate({ opacity: 1}, 500);
            });
        });
        return island;
    }

    
    _loadMemo(){
        let self = this;
        self._load('svg/memo-383982.svg').then(async (frag) => {
            self._memo = Snap(frag);
            self.getRoot().append(self._memo); 
            let bbox = self._container.getBBox();
            let eltBbox = self._memo.getBBox();
            self._memo.attr({
                x: (bbox.r2/2) - eltBbox.r2 +'px',
                y: (bbox.r1/2) - eltBbox.r1 + 'px',
                opacity:1
            });
            // add close button
            self._load('svg/shut-down-1540630.svg').then(async (frag) => {
                let btn = Snap(frag);
                self._memo.append(btn);
                btn.attr({
                    height:'16px',
                    x:'125px',
                    y:'20px'
                });
                btn.node.onclick = (()=>{
                    console.log('click close button');
                });
                btn.node.onmouseover = (()=> {
                    console.log('close button mouse in');
                });
                /*
                btn.node.onmouseout = (()=> {
                    console.log('close button mouse out');
                });*/
            })
        });
    }

    async _writeMemo(key){
        let self = this;
        this._memo.animate({opacity:1},500,mina.easeinout(), ()=>{
            self._writeCitation(self._citations[key]);
        });
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
                         500, 
                         mina.easeinout,
                         ()=>{resolve(text);
            });    
        });
        return promise;
    }
    

    
}