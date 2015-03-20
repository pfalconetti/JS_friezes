function arcPath(Ox, Oy) {
    // FIXME PPF
    // This function calculates the path of a circle arc made of multiple arc segments.
    
    var svgpath = 'M'+Ox+','+Oy+' ';
        svgpath+= arcSegPath(120,90,20)+' ';
        svgpath+= arcSegPath(120,30,40)+' ';
        svgpath+= 'z';
        
    return svgpath;

}

function arcSegPath(radius, angleDeg, thickness) {
    // This function calculates the path of a small circle arc through a Bézier curve.
    // The center of the circle is the last position of the SVG point.
    // This little segment can eventually be replicated to make a bigger arc.
    // The angle must be inferior to a quarter of a circle, otherwise it wouldn't have much sense.
    // This function returns the SVG path to draw the segment and replaces the point at the center of the circle.
    
    // Circular borders
    var radiusOuter = radius+thickness/2;
    var radiusInner = radius-thickness/2;

    // Switching to radians
    var angleRad = (angleDeg/180)*Math.PI;
    var n = Math.PI*(2/angleRad);

    // The control point is on the tangent line passing through the summit.
    // To know the position of the control point, we need to know its distance to its summit : dist = (4/3)*Math.tan(Math.PI/(2/n))*radius
    // Ref: http://commons.wikimedia.org/wiki/File:Circle_and_cubic_bezier.svg
    // Ref: http://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
    var distOuter = (4/3)*Math.tan(Math.PI/(2*n))*radiusOuter;
    var distInner = (4/3)*Math.tan(Math.PI/(2*n))*radiusInner;
    
    // Let's put the control points on circles, so it'll be easier to get their position with the appropriate angles.
    // On a circle, if we know the position of a point (summit), and the position of its control point, then we know the distance between the control point and the center of the circle.
    var radiusCpOuter = Math.sqrt(Math.pow(radiusOuter,2)+Math.pow(distOuter,2));
    var radiusCpInner = Math.sqrt(Math.pow(radiusInner,2)+Math.pow(distInner,2));
    
    // The arc is made of 4 summits (a,b,e,f), each summit need a control point to set the curve (h,c,d,g).
    // Summit are rather easy to position starting from the center of the circle.
    // Control points depend on the chosen angle, the distance to the center, and the length of the arc.
    // There is no exact formula to draw a Bézier curve "circle" with control points: only approximation.
    var ax = radiusInner;
    var bx = radiusOuter;
    var cx = radiusOuter;
    var cy = distOuter;
    var dx = Math.cos(angleRad-Math.atan(radiusOuter/distOuter)/(n/2))*radiusCpOuter;
    var dy = Math.sin(angleRad-Math.atan(radiusOuter/distOuter)/(n/2))*radiusCpOuter;
    var ex = Math.cos(angleRad)*radiusOuter;
    var ey = Math.sin(angleRad)*radiusOuter;
    var fx = Math.cos(angleRad)*radiusInner;
    var fy = Math.sin(angleRad)*radiusInner;
    var gx = Math.cos(angleRad-Math.atan(radiusInner/distInner)/(n/2))*radiusCpInner;
    var gy = Math.sin(angleRad-Math.atan(radiusInner/distInner)/(n/2))*radiusCpInner;
    var hx = radiusInner;
    var hy = distInner;
    
    // SVG syntax.
    var svgpath = 'm'+ax+',0 ';
        svgpath+= 'h'+(bx-ax)+' ';
        svgpath+= 'c'+(cx-bx)+','+cy+' '+(dx-bx)+','+dy+' '+(ex-bx)+','+ey+' ';
        svgpath+= 'l'+(fx-ex)+','+(fy-ey)+' ';
        svgpath+= 'c'+(gx-fx)+','+(gy-fy)+' '+(hx-fx)+','+(hy-fy)+' '+(ax-fx)+','+(-fy)+' ';
        svgpath+= 'm-'+ax+',0 ';
    
    return svgpath;
    
}
