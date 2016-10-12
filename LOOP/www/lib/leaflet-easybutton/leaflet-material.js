'use strict';

L.Control.include({
  defaultMaterialOptions: {
    fab: true,
    miniFab: true,
    rippleEffect: true,
    toolTips: false,
    color: 'lime-A200'
  },
  _setDefaultOptions: function () {
    var materialOptions = {};
    for (var attrname in this.defaultMaterialOptions) {
      materialOptions[attrname] = this.defaultMaterialOptions[attrname];
    };

    if (typeof this.options.materialOptions !== 'undefined') {
      for (var attrname in this.options.materialOptions) {
        materialOptions[attrname] = this.options.materialOptions[attrname];
      }
    };
    return materialOptions;
  },
  _addToolTip: function (el, idTag, toolTipText) {
    var parentNode = el.parentNode,
        toolTipNode = L.DomUtil.create('div', 'mdl-tooltip', parentNode);
    toolTipNode.setAttribute('for', idTag);
    toolTipNode.innerHTML = toolTipText;

    return toolTipNode;
  },
  _createMaterialButton: function (idTag, iconText, title, container, optionalClass) {
    var materialClass = 'mdl-button mdl-js-button mdl-button--icon',
        materialOptions = this._setDefaultOptions(),
        button = L.DomUtil.create('button', materialClass, container);

    this._materialIcon = L.DomUtil.create('i', 'material-icons', button);
    this._materialIcon.innerHTML = iconText;
    button.title = title;
    button.id = idTag;

    if (materialOptions.fab) {
      L.DomUtil.removeClass(button, 'mdl-button--icon');
      L.DomUtil.addClass(button, 'mdl-button--fab');
      if (materialOptions.miniFab) {
        L.DomUtil.addClass(button, 'mdl-button--mini-fab');
      }
    }
    if (materialOptions.rippleEffect) {
      L.DomUtil.addClass(button, 'mdl-js-ripple-effect');
    }
    if (materialOptions.color) {
      var colorClass;
      if (typeof materialOptions.color === "boolean") {
        colorClass = 'mdl-button--colored';
      } else {
        switch (materialOptions.color) {
          case "colored":
            colorClass = 'mdl-button--colored';
            break;
          case "primary":
            colorClass = 'mdl-button--primary';
            break;
          case "accent":
            colorClass = "mdl-button--accent";
            break;
          default:
            colorClass = 'mdl-color--' + materialOptions.color;
        }
      }

      L.DomUtil.addClass(button, colorClass);
    }
    if (optionalClass) {
      L.DomUtil.addClass(button, optionalClass);
    }
    if (materialOptions.toolTips) {
      this._materialToolTip = this._addToolTip(button, idTag, title);
      button.removeAttribute('title');
    }

    this._materialButton = button;
    return this._materialButton;
  }
});

L.Control.MaterialZoom = L.Control.Zoom.extend({
  onAdd: function (map) {
    var container = L.DomUtil.create('div','leaflet-control-zoom-mdl leaflet-bar-mdl'),
        options = this.options;

    options.zoomInText = options.zoomInText === "+" ? '+' : options.zoomInText;
    options.zoomOutText = options.zoomOutText === "-" ?'-' : options.zoomInText;

    this._zoomInButton = this._createMaterialButton('leaflet-zoom-in-mdl', options.zoomInText, options.zoomInTitle, container);
    this._zoomOutButton = this._createMaterialButton('leaflet-zoom-out-mdl', options.zoomOutText, options.zoomOutTitle, container);
    this._addZoomFunction(this._zoomInButton, this._zoomIn);
    this._addZoomFunction(this._zoomOutButton, this._zoomOut);

    this._updateDisabled();
    map.on('zoomend zoomlevelschange', this._updateDisabled, this);

    return container;
  },

  _addZoomFunction: function (button, fn) {
    L.DomEvent
        .on(button, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(button, 'click', L.DomEvent.stop)
        .on(button, 'click', fn, this)
        .on(button, 'click', this._refocusOnMap, this);
    return button;
  },

  _updateDisabled: function () {
      var map = this._map;

      this._zoomInButton.removeAttribute('disabled');
      this._zoomOutButton.removeAttribute('disabled');

      if (this._disabled || map._zoom === map.getMinZoom()) {
        this._zoomOutButton.setAttribute('disabled', true);
      }
      if (this._disabled || map._zoom === map.getMaxZoom()) {
          this._zoomInButton.setAttribute('disabled', true);
      }
  }
});
