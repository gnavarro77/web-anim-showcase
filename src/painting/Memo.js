class Memo {
    
    _node = null;
    
    
     constructor() {
     }
    
    
    
    
    async initialize() {
        let self = this;
        let url = 'svg/memo-383982.svg';
        let promise =  new Promise(async function(resolve, reject) {
             Snap.load(url,async (frag)=>{
                 self._node = new Snap(frag.node.firstElementChild);
                 await self._addCloseButton();
                resolve(self);
             });
        });    
        return promise;
    }
    
    getNode() {
        return this._node;
    }

    async close(){
        let self = this;
        this._node.animate({opacity:0},500, mina.easeinout(), ()=>{
            self.clear();
            //this._node.data('island', null);
        });
    }

    /**
    * Remove all 'text' tags from Memo
    */
    clear(){
        this._node.selectAll('text').forEach((line)=>{line.remove();});
    }

    /**
    * Add a close button to the memo
    */
    _addCloseButton(){
        let self = this;
        Snap.load('svg/shut-down-1540630.svg', (frag)=>{
            let btn = new Snap(frag.node.firstElementChild);
            self._node.append(btn);
            btn.attr({
                height:'16px',
                x:'125px',
                y:'20px'
            });
            btn.node.onclick = (()=>{
                self.close();
            });
        });
    }
    
    
}