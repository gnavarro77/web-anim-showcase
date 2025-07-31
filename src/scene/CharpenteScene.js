class CharpenteScene extends Scene {


    _tooltip = null;
    _labels = [];

constructor(){
    super();
}


getSceneUrl(){
    return 'svg/charpente/charpente.svg';
}


async stage(){
    let self = this;
    await this.loadTooltip();
    
    this._scene.selectAll('g').forEach((layer)=>{
        let id = layer.node.id;
        //console.log(id);
        if (id != 'titre'){
            layer.addClass('clickable');
            layer.click((event)=>{
                self.tooltipIn(event);   
            });
        }
    });
}


async loadTooltip(){
    let self = this;
    let url = 'svg/tooltip.svg';
    return new Promise(async function(resolve, reject) {
        Snap.load(url,async (frag)=>{
            self._tooltip = new Snap(frag.node.firstElementChild);
            self._tooltip.addClass('tooltip');
            //Effects.fadeOut(self._tooltip,0);
            resolve(self._scene.node);
        });
    });       
};



tooltipIn(event) {
    //console.log('tooltipIn');
    
    let layer = this._findNearestLayer(event.target);
    let label = layer.attr('inkscape:label');
    if (!this._labels.includes(label)) {
        this._labels.push(label);
        
        const {clientX, clientY} = event;
        let tooltip = this._tooltip.clone();
        this._scene.append(tooltip);
        const tooltipMatrix = tooltip.attr('transform').localMatrix;
        
        let sceneMatrix = this._scene.node.getScreenCTM();
        const mouseStart = this.transformFromViewportToElement(clientX, clientY, sceneMatrix, tooltipMatrix);
        
        const {height} = tooltip.getBBox();
        tooltip.attr({
            x:mouseStart.x,
            y:mouseStart.y - height
        });
        
        let txt = tooltip.select('text');
        txt.node.innerHTML = label;
    }
    
}


_addTooltipText(label) {
    
}


_findNearestLayer(elt) {
    
    let BreakException = {};
    
    let layer = null;
    let mode = null;
    let parents = SvgHelper.selectParents(event.target);
    try {
        parents.forEach((elt) => {
            layer = new Snap(elt)
            mode = layer.attr('inkscape:groupmode');
            //console.log('mode ' + mode);
            if (mode == 'layer'){
                throw BreakException;
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }
    return layer;
}




}