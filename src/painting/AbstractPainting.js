
const SVG = SvgHelper;

class AbstractPainting {

    _container = null;

constructor(container){
    this._container = container;
}


async _init(href) {
    const text = await SVG.getFileContent(href);
    this._container.innerHTML  = text;
    
}



getContainer(){
    return this._container;
}





}