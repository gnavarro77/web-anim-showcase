class BurgerScene extends Scene {

    _menu = null;
    _zoom = null;

    _targetZoom = 4.5;
    _currentZoom = 1;
    _zoomPoint = {x:0,y:0};
    _zoomOffset = 0.03;

    constructor(){
        super();
    }


    getSceneUrl(){
        return 'svg/burger/burger.svg';
    }


    async stage(){
        let self = this;
        self._menu = self._scene.select('#menu');
        
        
        self.onClickZoomIn();
        
        self._zoom = svgPanZoom('#burgerScene', {
              panEnabled: false,
              controlIconsEnabled: false, 
              zoomEnabled: true, 
              dblClickZoomEnabled: false,
              mouseWheelZoomEnabled: false,
              preventMouseEventsDefault: true, 
              zoomScaleSensitivity: 0.1,
              minZoom: 0.5, 
              maxZoom: 10, 
              fit: true, 
              contain: false,
              center: true,
              refreshRate: "auto",
              beforeZoom: null,
              onZoom: null,
              beforePan: null,
              onPan: null,
              customEventsHandler: null,
              eventsListenerElement: null,
              onUpdatedCTM: null            
        });
        
        let sceneMatrix = this._scene.node.getScreenCTM();
        const menuMatrix = self._menu.attr('transform').localMatrix;
        
        let {x, y} = self._menu.getBBox();
        self._zoomPoint = this.transformFromViewportToElement(x, y, sceneMatrix, menuMatrix);
        self._zoomPoint.x -= 100;
        self._zoomPoint.y -= 75;
         
    }
    

    onClickZoomIn() {
        let self = this;
        self._menu.click(function(){
            self._disableOnClick();
            window.requestAnimationFrame(self._zoomIn.bind(self));
        });
    }

    onClickZoomOut(){
        let self = this;
        self._menu.click(function(){
            self._disableOnClick();
            window.requestAnimationFrame(self._zoomOut.bind(self));
        });
    }
    
    
    _disableOnClick(){
        this._menu.node.onclick = function(){
            console.log('on click is disabled');
        }
    }


    _zoomIn(time) {
        let self = this;
        self._currentZoom += self._zoomOffset;
        self._zoom.zoomAtPoint(self._currentZoom, {
            x: self._zoomPoint.x ,
            y: self._zoomPoint.y
        });
        if ( self._currentZoom < self._targetZoom) {
            window.requestAnimationFrame(self._zoomIn.bind(self))
        } else {
            self.onClickZoomOut();
        }
    }
    
    _zoomOut(time) {
        let self = this;
        self._currentZoom -= self._zoomOffset;
        self._zoom.zoomAtPoint(self._currentZoom, {
            x: self._zoomPoint.x ,
            y: self._zoomPoint.y
        });
        if ( self._currentZoom > 1) {
            window.requestAnimationFrame(self._zoomOut.bind(self))
        } else {
            self.onClickZoomIn();
        }
    }

}