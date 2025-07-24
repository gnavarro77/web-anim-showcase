class Memo {
    
    _node = null;
    
    _lines = null;
    _currentAnim = null;
    _currentIdx = 0;
    _currentPos = null;

    _stopped = false;
    _dirty = false;
    

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

    /**
    * Set first line position 
    */
    _setupStartPosition(){
        let bbox = this._node.select('#screenBox').getBBox();
        this._currentPos = {
            x:bbox.x,
            y:bbox.y,
            width:bbox.width
        }
    }

    async writeLines(lines){
        if (this._dirty){
            this.stop();
            this.clear();
        }
        if (!this._isVisible()) {
            await this.show();
        }
        this._reset();
        this._setupStartPosition()
        this._lines = lines;
        this._writeLinesSeq();
    }
    


    stop(){
        let anim = null;
        if (this._currentAnim != null && this._currentAnim.anims != null){
            for (const [key, value] of Object.entries(this._currentAnim.anims)) {
                anim = this._currentAnim.anims[key];
                anim.stop();
            }
        }
    }



    /**
    * Close the memo
    */
    async close(){
        this.stop();
        let self = this;
        this._node.animate({opacity:0},500, mina.easeinout(), ()=>{
            self.clear();
        });
    }

    /**
    * Remove all 'text' tags from Memo
    */
    clear(){
        this._node.selectAll('text').forEach((line)=>{line.remove();});
    }

    
    show(){
        let self = this;
        return  new Promise(async function(resolve, reject) {
            self._node.animate({opacity:1},500, mina.easeinout(), ()=>{
                resolve('done');
            });
        });    
    }

    /**
    * Write multiple lines to memo
    */
    async _writeLinesSeq(){
        let self = this;
        let line = await this._writeLine();
        this._dirty = true;
        if (this._hasMoreLine()){
            this._setupNexLine(line);
            await this._writeLinesSeq();
        }    
    }

    /**
    * Write a line to memo
    */
    async _writeLine(){
        let self = this;
        let content = this._lines[this._currentIdx];
        let pos = this._currentPos;
        
        let promise =  new Promise(async function(resolve, reject) {
            let text = self._node.text(0, 0, content);
            const textPath = `M${pos.x}, ${pos.y} h ${pos.width}`;
            text.attr({
                textLength:0,
                opacity:0,
                textpath: textPath,
                class:'memo-text'
            });
            self._currentAnim = await text.animate({textLength:pos.width, opacity:1}, 
                         350, 
                         mina.easeinout,
                         ()=>{resolve(text);
            });    
        });
        return promise;
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


    _setupNexLine(line){
        let bbox = line.node.getBBox();
        this._currentPos.y += bbox.height;
        if (this._isLastLine()){
            this._currentPos.y += bbox.height;
            this._currentPos .width = this._currentPos .width / 2;
        }
        this._currentIdx++;
    }
    
    _isLastLine(){
        return this._currentIdx == this._lines.length - 2;
    }

    _hasMoreLine(){
        return this._currentIdx != this._lines.length - 1;
    }

    _isVisible(){
        return this._node.attr('opacity') == 1;
    }
    
    _reset(){
        this._lines = null;
        this._currentAnim = null;
        this._currentIdx = 0;
        this._currentPos = null;
        this._stopped = false;
        this._dirty = false;
    }
}