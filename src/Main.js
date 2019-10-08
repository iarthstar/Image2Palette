"use strict";

var Dom = require("sketch/dom");

function generateLayer(id, layer, sibling) {
    var Doc = Dom.getSelectedDocument();
    var parent = Doc.getLayerWithID(id);
    if(sibling == false){
        parent = parent.parent;
    }

    var tag = layer.tag;

    layer = layer.contents;
    layer.id = undefined;
    layer.style.id = undefined;
    console.log("PARENT ------>", parent);
    console.log("LAYER ------->", layer);
    switch (tag) {

        case "Shape":
            layer.shapeType = undefined;
            return parent.layers.push(new Dom.Shape(layer));
        
        case "Text":
            return parent.layers.push(new Dom.Text(layer));

        case "Group":
            var children = layer.layers;
            layer.layers = undefined;

            var group = new Dom.Group(layer);
            parent.layers.push(group);

            children.forEach(elem => {
                generateLayer(group.id, elem, true);
            });
            return group.adjustToFit();

        default: 
            return;
    }
}

exports["newLayer"] = id => layer => {
    return () => {
        generateLayer(id, layer, false);
        return {};
    };
}



exports["getBase64StrFromLayerID"] = id => {
    let document = Dom.getSelectedDocument();
    let layer = document.getLayerWithID(id);
    if (layer) {
        return layer.image.nsdata.base64EncodedStringWithOptions(0);
    } else {
        return "Error";
    }
}