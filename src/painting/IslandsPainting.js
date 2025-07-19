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
        let ile = document.getElementById('ilecascade');

        let tx = 0;
        let ty = -1;
        const expr = `translate(0,0)`;

        let matrix = ile.transform;

        const animSVG = SVG.createTag('animateMotion');
        SVG.setAttributes(animSVG,{
            path:"M0,0 q60,100 100,0 q60,-20 100,0",
            begin:"0s",
            dur:"10s",
            repeatCount:"indefinite"
        });
        
        ile.appendChild(animSVG);
        
/*
        <animateMotion
        path="M0,0 q60,100 100,0 q60,-20 100,0"
        begin="0s"
        dur="10s"
        repeatCount="indefinite" />


            ile.animate([{ transform:  expr}], {
            duration: 1000,
            //fill: 'forwards',
            easing: "ease-in-out"
        });
        
        
        */
    }



}