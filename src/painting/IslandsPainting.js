class IslandsPainting extends AbstractPainting {

    constructor() {
        super();
    }

    
    async init(){
        return this._load('svg/fantasy-world-2023256.svg');
    }
    
    
    async stage(){
        let self = this;
        self._load('svg/chicken-2521141.svg').then((frag) => {
            self.getRoot().append(frag.node);
        });   
    }
    
    
    
    
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