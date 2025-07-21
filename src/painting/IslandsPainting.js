class IslandsPainting extends AbstractPainting {

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
        
        self._load(url).then((frag) => {
            let ileCascade = Snap.select('#ilecascade');
            let warrior = Snap(frag.node);

            Snap(warrior.node).attr({
                x:'212px',
                y:'20px',
                height:'80px',
                opacity:0
            });

            ileCascade.append(warrior);
            
            
            let ile = Snap.select('#ilecascade');
            ile.node.dispatchEvent(new Event('dblclick'));

            ile.node.onclick = (()=>{
                console.log('click click');
                warrior.animate({opacity: 1}, 500);
                
            });
            
            this._appendMemo();
        });   
    }
    
    _appendMemo(){
        let self = this;
        let url = 'svg/memo-383982.svg';
        self._load(url).then((frag) => {
            let memo = Snap(frag.node);
            self.getRoot().append(memo);    
            let bbox = self._container.getBBox();
            let eltBbox = memo.getBBox();
            memo.attr({
                x: (bbox.r2/2) - eltBbox.r2 +'px',
                y: (bbox.r1/2) - eltBbox.r1 + 'px',
                opacity:0
            });
            memo.animate({opacity:1},500,mina.easeinout(), ()=>{
                console.log('memo appended!');
                let screen = memo.select('#screen');
                
                
                let citations = {
                    'suntzu' : ['Celui qui excelle à',
                                'résoudre les difficultés',
                                'le fait avant qu\'elles ne surviennent.']
                }
                
                
                
                let t1 = memo.text(0, 0, citations['suntzu'][0]);
                
                
                let bbox = memo.select('#screenBox').getBBox();
                t1.attr('textLength', bbox.width);
                const textPath = `M${bbox.x}, ${bbox.y} h ${bbox.width}`;
                
                t1.attr({
                    textpath: textPath,
                    class:'memo-text'
                });
                
                
                screen.append(t1);
            });
        });
    }
    
    
    _writeSentence(text){
        let screen = memo.select('#screen');
        
    }
    
    _writeLine() {
        
    }
    
    
    
    /*
    <text
         xml:space="preserve"
         style="font-size:64.0004px;line-height:1.25;font-family:'Book Antiqua';-inkscape-font-specification:'Book Antiqua';stroke-width:1.00001"
         x="21.808857"
         y="99.486526"
         id="text1"><tspan
           sodipodi:role="line"
           id="tspan1"
           style="stroke-width:1.00001"
           x="21.808857"
           y="99.486526">Test</tspan></text>*/
    
/*
    async _init(href) {
        await super._init(href);
        this._setupIleCascade();
    }



    async _setupIleCascade(){

        let ile = null;
        let self = this;
        setTimeout(async  function (){
            ile = document.getElementById('ilecascade');
            ile.dispatchEvent(new Event('dblclick'));

            ile.onclick = (()=>{
                console.log('click click')        ;
            });

            
            

            let chicken = await self._loadChicken();
            var snapChicken = Snap(chicken);

            self._snapContainer.append(chicken);
            //snapChicken.transform('scale(0.5)');
            
            let y = self._getContainerHeight() - snapChicken.getBBox().height;
            
            snapChicken.transform('translate(10,'+y+')');
            
        }, 1000);

        
    }

    async _loadChicken() {
        let markup =  await SVG.getFileContent('svg/chicken-2521141.svg');
        let elt = SVG.parseSvg(markup);
        let chicken = elt.getElementById('chicken');
        return chicken;
    }

*/
}