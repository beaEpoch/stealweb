// Enumerate all elements and their xpath, location, geometry, color, text, HTML
var nodepath = [];
function addpath(element, xpath) {
    var rect = element.getBoundingClientRect();
    var offsetx = window.pageXOffset;
    var offsety = window.pageYOffset;
    var visible = (window.getComputedStyle(element, null).display != 'none')?1:0;
    var fgcolor = window.getComputedStyle(element, null).color;
    var bgcolor = window.getComputedStyle(element, null).getPropertyValue('background-color');
    var text = element.innerText;
    var html = element.outerHTML;
    nodepath.push([element, xpath, visible, rect.left+offsetx, rect.top+offsety, rect.width, rect.height, fgcolor, bgcolor, text, html]);
};
var pathwalker = function(element, basepath) {
    var children = element.childNodes;
    var tagmap = {} // offset list for each children's tag
    for (var i=0; i<children.length; i++) {
        if (!children[i].tagName) continue;
        var tag = children[i].tagName.toLowerCase();
        if (tagmap[tag]) {
            tagmap[tag].push(i);
        } else {
            tagmap[tag] = [i];
        };
    };
    for (var i=0; i<children.length; i++) {
        if (!children[i].tagName) {
            continue // usually comment node
        };
        var tag = children[i].tagName.toLowerCase();
        /*
        if (tag.indexOf(':') >= 0) {
            continue // ignore everything with a prefix or namespace
        };
        */
        var xpath = basepath+'/'+tag;
        if (tagmap[tag].length > 1) {
            xpath = xpath + '[' + (tagmap[tag].indexOf(i)+1) + ']';
        };
        addpath(children[i], xpath);
        pathwalker(children[i], xpath);
    };

};
pathwalker(document, '');
return nodepath;
// vim:set ts=4 sw=4 et:
