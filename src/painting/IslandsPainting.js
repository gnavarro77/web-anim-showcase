class IslandsPainting extends AbstractPainting {



    constructor(container) {
        super(container);
        this._init('svg/fantasy-world-2023256.svg');
    }


    async _init(href) {
        await super._init(href);
        this._setupIleCascade();
    }



    _setupIleCascade(){

        setTimeout(function (){
            let ile = document.getElementById('ilecascade');
            ile.dispatchEvent(new Event('dblclick'));
            
            
            let ileAnim = document.getElementById('ileCascadeAnim');
            ileAnim.begin = null;
            
        }, 1000);


    }



}