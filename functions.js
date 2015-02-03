function arcSegment() {
    
    // Initialization of the canvas
    var can = document.getElementById('myCanvas');
    var ctx = can.getContext('2d');
    
    // Parameters for the segments
    var graphYearStart = 1997;
    var graphYearEnd = 2015;
    var graphYearSubs = graphYearEnd-graphYearStart+1;
    var graphSize = 1.9;
    var graphYearAngle = (graphSize*Math.PI)/graphYearSubs;
    var graphYearAngleStart = 0.5*Math.PI;
    var graphYearAngleEnd = graphYearAngleStart+graphSize*Math.PI;
    var graphYearGap = 0.02;
    // Segments layout
    var segRadialSubs = 8; // Number of radial subdivisions, strictly positive
    var segRadiusMax = 150; // Max radius for all segments: they'll be displayed in a zone of segRadiusMax*2 per segRadiusMax*2 pixels
    var segRadialWidth = segRadiusMax/segRadialSubs;
    var segWidthProportion = 2; // Segment width, in number of radial subdivisions, stricly positive
    var segWidth = segRadialWidth*segWidthProportion;
    // Segments common center
    var segCenterX = 200;
    var segCenterY = 200;
    // Segment individual properties
    var segLevel = 6; // Starting radial level for drawing the segment
    var radius = segRadialWidth*segLevel+segWidth/2+0.5;
    var segGradientRadiusStart = segLevel*segRadialWidth; // Inner border of the segment = starting point for radial gradient
    var segGradientRadiusEnd = (segLevel+segWidthProportion)*segRadialWidth; // Outer border of the segment = ending point for radial gradient
    var segment = ctx.createRadialGradient(segCenterX,segCenterY,segGradientRadiusStart,segCenterX,segCenterY,segGradientRadiusEnd);
    segment.addColorStop(0,'#f00'); // Inner color for gradient
    segment.addColorStop(1,'#900'); // Outer color for gradient
    var segYearStart = 1997.5; /* FIXME PPF */
    var segYearEnd = 2014;
    var segStart = graphYearAngleStart+(segYearStart-graphYearStart)*graphYearAngle;
    var segStart2= graphYearAngleStart+(Math.ceil(segYearStart)-graphYearStart)*graphYearAngle; /* FIXME PPF */
    var segEnd = graphYearAngleStart+(segYearEnd-graphYearStart)*graphYearAngle;
    var shadeStart = graphYearAngleStart;
    var shadeEnd = graphYearAngleStart+(graphYearEnd-graphYearStart)*graphYearAngle-graphYearGap;
    
    // Segment width
    ctx.lineWidth = segWidth;
        
    // Drawing shadow for the complete length, before individual and final renderings
    ctx.shadowBlur=20;
    ctx.shadowColor="black";
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.arc(segCenterX,segCenterY,radius,shadeStart,shadeEnd,false);
    ctx.stroke();
    //ctx.closePath();
    
    // Drawing multiple successive segments separated by years (final rendering)
    ctx.shadowBlur=0;
    // First arc, in case it is fractionnal
    ctx.beginPath();
    ctx.strokeStyle = segment;
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; /* FIXME PPF */
    ctx.arc(segCenterX,segCenterY,radius,segStart,segStart2-graphYearGap,false);
    ctx.stroke();
    // All other arcs
    for (i=0; i<(segYearEnd-segYearStart-1); i++) {
        ctx.beginPath();
        ctx.strokeStyle = segment;
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; /* FIXME PPF */
        ctx.arc(segCenterX,segCenterY,radius,segStart2+(i*graphYearAngle),segStart2+((i+1)*graphYearAngle-graphYearGap),false);
        ctx.stroke();
    }
    //ctx.closePath();

}