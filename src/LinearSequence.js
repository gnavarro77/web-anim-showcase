

class LinearSequence {

    _elements = null;
    _keyframes = null;
    _options = null;
    _animations = null;

constructor(elements){
    this._elements = elements;
    this._animations = new Array();
}


async run(keyframes, options){
    let self = this;
    self._keyframes = keyframes;
    self._options = options;
    let promise = new Promise(async function(resolve, reject) {
        await self._step(0);
        resolve("done!");
    });
    return promise;
}

async reverse(){
    await this._reverseStep(0);
    
}

async _reverseStep(idx){
    let anim = this._animations[idx];
    anim.reverse();
    await anim.finished;
    if ( idx < this._animations.length -1){
        await this._reverseStep(++idx);
    }
}


async _step(idx = 0){
    let tag = this._elements[idx];
    if (SvgHelper.getAttribute(tag, "ignore") != true) {
        await this._animate(tag);    
    }
    if (idx < this._elements.length -1){
        await this._step(++idx);
    }
}


async _animate(elt){
    let anim = elt.animate(this._keyframes,this._options);
    this._animations.push(anim);
    await anim.finished;
    return anim.finished;
}


}