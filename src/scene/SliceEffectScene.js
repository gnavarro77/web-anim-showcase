class SliceEffectScene extends Scene {


    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/effect/slice.svg';
    }

    async stage(){
        let main = this._scene.select('#main');
        let text = main.selectAll('text').items[0];


        this._addPlayButton().then((btn)=>{

            btn.click(function(){
                new SliceEffect(text,{
                    'cut' :{
                        'docut' : true
                    },
                    slide : {
                        offsetX : 3,
                        offsetY : 3
                    }
                }).run();
                
                btn.fadeOut();
                
            });
        });


    }


}