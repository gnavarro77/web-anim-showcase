class CharpenteScene extends Scene {


    _tooltip = null;

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
        console.log(id);
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
    console.log('tooltipIn');
    const {clientX, clientY} = event;
    
    this._scene.append(this._tooltip);
    const currentTransform = this._tooltip.attr('transform').localMatrix;
    let ctm = this._scene.node.getScreenCTM();
    
    const mouseStart = this.transformFromViewportToElement(clientX, clientY, ctm, currentTransform);
    const {height} = this._tooltip.getBBox();
    this._tooltip.attr({
        x:mouseStart.x,
        y:mouseStart.y - height
    });
    
    
    let layer = this._findNearestLayer(event.target);
    let label = layer.attr('inkscape:label');
    console.log('label : ' + label);
    
    let labelNode = SvgHelper.createTextNode(label, {
        "x":10,
        "y":10,
        "font-size":"16px",
        "fill":"#212E53"}
    );
    let txt = this._tooltip.select('#content');
    txt.node.innerHTML = label;
    /*
    <text xml:space="preserve" style="font-size:10.6667px;line-height:1.25;font-family:'Book Antiqua';-inkscape-font-specification:'Book Antiqua, Normal'" x="13.13308" y="10.410368" id="text1">
    <tspan sodipodi:role="line" id="tspan1" x="13.13308" y="10.410368">test</tspan></text>
    */
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