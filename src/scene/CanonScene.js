class CanonScene extends Scene {

    _canon = null;
    _tube = null;
    _roues = [];
    _explosion = null;
    _trajectoires = null;
    _trajectoireContainer = null;
    
    
    _firePos = {x:0, y:0};

    _sacDeLettres = null;
    _citation = 'Les Racines du ciel';
    //_citation = 'va';
    _sacDeLettres = null;
    _letters = [];

    _offsetCanon = 35;

    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/canon/canon.svg';
    }


    async stage(){
        let self = this;
        this._canon = this._scene.select('#canon');
        self._canon.slideX(-self._offsetCanon, 0);
        
        
        let {x,y,w,h} = this._canon.getBBox();
        this._firePos = {
            x : x + w,
            y : y
        };
        
        ['#roue1','#roue2'].forEach((id) => {
            self._roues.push(self._canon.select(id));
        });
        this._tube = this._scene.select('#tube');
        this._explosion = this._scene.select('#explosion');
        this._explosion.hide();
        
        this._trajectoireContainer = this._scene.select('#trajectoires');
        this._trajectoires = this._trajectoireContainer.selectAll('path');
        Snap.hideAll(this._trajectoires);
        
        this._sacDeLettres = new Stack(this._citation.split('').reverse());
        
        this._addPlayButton().then((btn)=>{
            btn.click(async function(){
                btn.fadeOut();
                await self._run();
                
            });
        });
        
    }


    async _run(){
        let self = this;
        
        // amene le canon
        await self._canon.slideX(self._offsetCanon, 5000);
        
        // lancer les lettres
        let isFirst = true;
        while(!this._sacDeLettres.isEmpty()) {
            await self._fire(this._sacDeLettres.pop(), isFirst);
            isFirst = false;
        }
        
        await Snap.sleep(3000);
        // retrait du canon
        self._canon.slideX(-100, 10000);
        
        // mide en position des lettres
        self._organizeLetters().then(async (box) => {
            let citation = self._aggregateLetters(box.w);
            await citation.scaleY(3,'top',2000,mina.easeinout);
            await Snap.sleep(2000);
            
            new SliceEffect(citation,{
                'clip' : {
                    percent : 40,
                    color : '#4d0000'
                }
            }).run();
            
        });
                
    }

    
    /**
    *
    */
    _aggregateLetters(textLength){
        let self = this;
        let first = self._selectFirstText();
        let x = first.attr('x');
        let y = first.attr('y');
        let transform = first.attr('transform');
        // remove all letters
        Snap.removeAll(this._trajectoireContainer.selectAll('text').items);
        let citation = self._createText(x, y, self._citation);
        this._trajectoireContainer.append(citation);
        citation.attr({
            'transform': transform,
            textLength : textLength,
            lengthAdjust : 'spacing'
        });
        return citation;
    }

    /**
    * Retourne la lettre marquee comme 'la premiere'
    */
    _selectFirstText() {
        return this._trajectoireContainer.selectAll('text').items
            .filter((l)=>{
                return l.attr('isFirst') == 'true';
            })[0];
    }

    /**
    * Affiche les lettres dans l'ordre d'origine
    */
    async _organizeLetters() {
        let self = this;
        
        let textElt = null;
        let pt = {
            x:20,
            y:20
        };
        
        let letterBox = self._letters[0].getBBox();
        let box = {
            x : pt.x,
            y : pt.y,
            h : letterBox.h,
            w : 0
        };
        let offset = letterBox.w;
        
        return  new Promise(async function(resolve, reject) {
            let citationIdx = 0;
            let chars = self._citation.split('');
            let anim = null;
            chars.forEach((char, idx)=>{
                textElt = self._selectText(self._letters, char);
                anim = textElt.translateTo({x:pt.x,y:pt.y});
                if( self._citation.charAt(citationIdx) == char){
                    pt.x += offset;    
                    citationIdx = idx+1;
                    box.w += offset;
                } else {
                    pt.x += offset * 2;   
                    citationIdx = idx + 2;
                    box.w += offset * 2;
                }
                if (idx == chars.length -1){
                    anim.then(()=>{
                        resolve(box);
                    });
                }
            });            
        }); 
    }
    
    
    /**
    * Retourne le premier element de texte dont le contenu correspond a la lettre passee en argument
    */
    _selectText(letters, char){
        let BreakException = {};
        let text = null;
        try {
            letters.forEach((elt, idx) => {
                if (elt.attr('letter') == char){
                    text=elt;
                    letters.splice(idx, 1);
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }
        return text;
    }
    



    /**
        *
        */
    async _fire(letter, isFirst = false){
        let self = this;
        let dur = 200;
        let promise = self._mvtCanon(0,dur);
        self._explosion.fadeIn(dur);
        self._throwLetter(letter, isFirst).then((text)=>{
            let bbox = text.getBBox();
            text.attr({ 
                'textpath': '',
                'x' : bbox.x,
                'y' : bbox.y2
            });
            let y =this._canon.getBBox().y2 - bbox.y2;
            let expr = `t0,${y}`;
            text.animate({transform:expr}, 2000, mina.linear);
        });

        return  new Promise(async function(resolve, reject) {
            promise.then(async ()=>{
                self._explosion.fadeOut(dur * 2);
                await self._mvtCanon(1,dur);
                resolve();
            });
        }); 
    }

    /**
    * Deplace la lettre le long d'une trajectoire
    */
    _throwLetter(letter = 'A', isFirst = false) {
        let self = this;
        let path = self._selectRandomPath()
        let {x,y} = path.getBBox();
        let length = path.getTotalLength();
        let text = self._createText(x,y,letter);
        self._letters.push(text);
        text.attr({ 
            'textpath': path.attr('d'), 
            letter : letter,
            isFirst : isFirst
        });
        text.textPath.attr({ 'startOffset': -(0.5 * length)});
        let coeff = (length < 150)?0.4:0.7;
        
        return  new Promise(async function(resolve, reject) {
            let anim = text.textPath.animate({ 'startOffset': coeff * length }, 500, function(){
                resolve(text);
            } );
        });  
    }

    /**
    *
    */
    _createText(x, y, content) {
        let text = this._trajectoireContainer.text(x,y,'');
        text.attr({ 
                 fill : "#C34A2C",
                'stroke-width' : "0px",
                'font-variant' : "all-small-caps",
                'font-size' : "16",
                //'font-weight' : "bold"
        });
        
        var tspan = Snap.parse(`<tspan>${content}</tspan>`);
        text.append(tspan);
        
        return text;
    }
    
    
    _selectRandomPath(){
        return this._trajectoires.items[Math.floor(Math.random()*this._trajectoires.items.length)];
    }

    async _mvtCanon(recul = 0, dur=1000) {
        let self = this;
        let offset = (recul == 0)? -10:10;
        let angle = (recul == 0)? -45:45;
        let angleCanon = (recul == 0)? -3:3;
        
        
        let promise = self._canon.slideX(offset, dur);
        self._wheel(self._roues[0], angle, dur);
        self._wheel(self._roues[1], angle, dur);
        let {cx, cy} = self._tube.getBBox();
        self._tube.wheel(angleCanon, {x:cx,y:cy}, dur);
        return  promise;
    }
    

    _wheel(wheel = null, angle = 0, dur=1000){
        let {cx, cy} = wheel.getBBox();
        return wheel.wheel(angle, {x:cx,y:cy}, dur);
    }
        

}