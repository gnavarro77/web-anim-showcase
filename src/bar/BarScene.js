class BarScene {
    
    _snap = null;
    
    _fiche = null;
    _ficheBox = null;
    _ficheVisible = false;
    _cocktails = {};
    
    _showFicheAnim = null;
    _clickedCocktailId = null;
    _selectedCocktailId = null;
    _selectedCocktail = null;
    
    constructor(){
        
    }
        
    async initialize(){
        let self = this;
        let url = 'svg/bar/bar.svg';
        let promise =  new Promise(async function(resolve, reject) {
             Snap.load(url,async (frag)=>{
                 self._snap = new Snap(frag.node.firstElementChild);
                resolve(self._snap.node);
             });
        });    
        return promise;
    }
    
    async stage(){
        this._registerCocktails();
        this._fiche = this._snap.select('#fiche');
        this._ficheBox = this._fiche.getBBox();
        this._fiche.attr({'width':0, 'height':0});
    }
   
    /**
    *
    */
    _registerCocktails(){
        let id = null;
        let cocktail = null;
        let indexes = [1,2,3];
        let self = this;
        
        indexes.forEach((idx) => {
            id = 'cocktail_' + idx;
            cocktail = new Snap(this._snap.select('#'+id));
            this._cocktails[id] = cocktail;
            cocktail.click((event)=>{
                self._onCocktailClick(event.currentTarget);
            });
        });
        
    }

    /**
    *
    */
    async _showFiche(){
        const self = this;
        const dur = 1000;
        self._showFicheAnim =  new Promise(async function(resolve, reject) {
            self._fiche.animate({
                    width:self._ficheBox.width,
                    height:self._ficheBox.height/10
                }, 
                dur, 
                mina.easingout, 
                ()=>{
                     self._fiche.animate({height:self._ficheBox.height},
                        dur,
                        mina.easingout,
                        ()=>{
                            resolve(true);
                            self._ficheVisible = true;
                            self._showFicheAnim = null;
                        }                                         
                    );
                }
            );
        });
        return self._showFicheAnim;
    }

    /** 
    * 
    */
    async _isFicheVisible() {
        let self = this;
        let promise = new Promise(async function(resolve, reject) {
            if (self._showFicheAnim != null) {
                self._showFicheAnim.then(()=>{
                    resolve(true);
                });
            } else {
                resolve(self._ficheVisible);
            }
        });
        return promise;
    }
   
    /**
    * cocktail selection event handler
    */
    async _onCocktailClick(cocktail){
        let self = this;
        self._clickedCocktailId = cocktail.id;
        console.log('clicked ' + cocktail.id);
        this._isFicheVisible().then(async (visible)=>{
            console.log('enter 0 ' + self._clickedCocktailId);
            if(!visible) {
                this._showFiche().then(()=>{
                    console.log('enter 1 ' + self._clickedCocktailId);
                    if (self._clickedCocktailId == cocktail.id) {
                        this._selectCocktail(cocktail);   
                    }
                }); 
            } else {
                console.log('enter 2 ' + self._clickedCocktailId);
                this._selectCocktail(cocktail);    
            }
        });
    }
    

    _isCocktailSelected(cocktail){
        let selected = false;
        if (this._selectedCocktailId != null) {
            selected = cocktail.id == this._selectedCocktailId
        }
        return selected;
    }

    _hasSelectedCocktail(){
        return this._selectedCocktail != null;
    }
    

    /**
    *
    */
    async _selectCocktail(cocktail) {
        console.log('select cocktail ' + cocktail.id);
        let matrices = {
            'cocktail_2' : {a:0.01, b:0, c:0, d:0.01, e:20, f:-100},
            'cocktail_3' : {a:0.8, b:0, c:0, d:0.8, e:155, f:-150},
            'cocktail_1' : {a:0.25, b:0, c:0, d:-0.25, e:55, f:50}
        }
        
        if (!this._isCocktailSelected(cocktail)) {
            if (this._hasSelectedCocktail()) {
                await this._unSelectCocktail();
            }
            this._selectedCocktailId = cocktail.id;
            this._selectedCocktail = new Snap(cocktail.lastElementChild).clone();
            new Snap(cocktail.parentNode).append(this._selectedCocktail);
            
            let expr = SvgHelper.matrixExpr(matrices[cocktail.id]);

            this._selectedCocktail.attr({opacity:0});
            this._selectedCocktail.transform(expr);
            this._selectedCocktail.animate({opacity:1},
                1000,
                mina.easingout);
        } 
    }

    /**
    *
    */
    async _unSelectCocktail(){
        const self = this;
        let promise =  new Promise(async function(resolve, reject) {
            self._selectedCocktail.animate({opacity:0.2},
                1000,
                mina.easingout,
                ()=>{
                    new Snap(self._selectedCocktail).remove();
                    self._selectedCocktailId = null;
                    resolve('done');
                }                                         
            );
        });
        return promise;
    }

}