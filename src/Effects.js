"use strict";


class Effects {


    static async fadeIn(elt, dur=1000, ease= mina.easeinout){
        return  new Promise(async function(resolve, reject) {
            elt.animate({opacity:1}, dur, ease,()=>{
                resolve();
            });
        });    
    }
    
    
    static async fadeOut(elt, dur=1000, ease= mina.easeinout){
        return  new Promise(async function(resolve, reject) {
            let index = null;
            if (Array.isArray(elt)){
                elt.forEach((e, idx) => {
                    index = idx;
                    console.log('forEach index => ' + idx);
                    e.animate({opacity:0}, dur, ease, function(){
                        console.log('lenght => ' + elt.length);
                        console.log('index => ' + index);
                        if (index == elt.length -1){
                            resolve();
                        }
                    }); 
                });
            } else {
                elt.animate({opacity:0}, dur, ease,()=>{
                    resolve();
                });    
            }
        });  
    }


    static async sleep(dur=1000) {
        return  new Promise(async function(resolve, reject) {
            setTimeout(() => {
                resolve();
            }, dur);
        });
    }


    static async vivus(elt, dur=1000) {
        var pathLength = elt.getTotalLength();
        elt.attr({
            'stroke-dasharray': `${pathLength} 0`
        });
        elt.attr('opacity',1);
        let lenght = 0;
        return  new Promise(async function(resolve, reject) {
            Snap.animate(0, pathLength, function(time){
                    length = `${time} ${pathLength - time}`;
                    elt.attr('stroke-dasharray', length);
                }, 
                dur, 
                mina.linear,
                ()=>{resolve()}
            );
        });
        
        
        
        
    }

}