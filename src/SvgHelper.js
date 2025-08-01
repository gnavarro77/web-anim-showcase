"use strict";


class SvgHelper {

    static svgNS = "http://www.w3.org/2000/svg";



static selectParents(elt) {
    let parents = [];
    let current = elt;
    let stop = false;
    while (current.parentElement != null && !stop){
        parents.push(current.parentElement);
        current = current.parentElement;
        stop = current.parentElement.nodeName == 'svg';
    }
    parents.push(current.parentElement);
    return parents;
}



static createTag(tagName){
    return document.createElementNS(SvgHelper.svgNS,tagName);
}

static setAttribute(elt, name, value){
    console.log("setAttributes " + elt + " " + name + " " + value);
    elt.setAttributeNS(SvgHelper.svgNS,name,value);  
}

static getAttribute(elt,name){
    return elt.getAttributeNS(SvgHelper.svgNS, name);  
}

static removeAttribute(elt, name){
    elt.removeAttributeNS(SvgHelper.svgNS, name);
}

static setAttributes(elt, attrs){
    for (const [key, value] of Object.entries(attrs)) {
        SvgHelper.setAttribute(elt, key, value);
    }
}

static async scale(elt, factorX, factorY) {
    const scaleExpr = "scale("+factorX+","+factorY+")";
    const anim = elt.animate([{ transform:  scaleExpr}],{
        duration:2000,
        fill: 'forwards',
        easing:"ease-in-out"
    });
    await anim.finished;
    return anim.finished;
}

static appendChildren(container, children){
    children.forEach((child) => {
        container.appendChild(child);
    });
}

/**
*
*/
static matrixExpr(matrix){
    let expr = `matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f})`;  
    return expr;
}

static inpectMatrix(elt) {
    const {local, global, total} = elt.transform();
    console.log({
        local:local,
        global:global,
        total:total
    });
}




static computeCenterCoords(elt) {
    let bounds = elt.getBBox();

    const coords = {
        'x' : bounds.width / 2,
        'y' : bounds.height / 2 
    };
    console.log(coords);
    return coords;
}

/**
*
*/
static createTextNode(label, attrs = {}){
    let text = SvgHelper.createTag("text");
    SvgHelper.setAttributes(text, attrs);
    let tspan = document.createTextNode(label);
    text.appendChild(tspan);
    return text;
}

static text2svg(text, fontSize){
    const letters = text.split("");
    let x = 0;
    let y = fontSize;

    let elements = new Array();
    let tag = null;

    letters.forEach((letter, idx) => {
        x += fontSize/2 + fontSize/2;
        tag = SvgHelper.letter2svg(letter, x, y, fontSize);
        //tag.id=idx;
        elements.push(tag);
    });
    return elements;
}



static letter2svg(letter, x, y, fontSize){       
    let tag = SvgHelper.createTag("text");
    const attrs = {
        "x":x,
        "y":y,
        "font-size":fontSize,
        "class":"letter",
        "fill":"#212E53",
        "opacity":1,
        "ignore":(letter === '')?true:false
    };
    SvgHelper.setAttributes(tag, attrs);
    let textNode = document.createTextNode(letter);
    tag.appendChild(textNode);
    return tag;
}

static async getFileContent(src){
    let text = null;
    await fetch(src)
        .then((res) => {
        text = res.text()})
        .catch((e) => console.error(e));
    return text;
}

/**
*/
static parseSvg(content){
    const parser = new DOMParser();
    return parser.parseFromString(content, "image/svg+xml");
}



}