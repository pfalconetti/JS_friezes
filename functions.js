function arcSegment() {
    
    // Initialization of the canvas
    var can = document.getElementById('myCanvas');
    var ctx = can.getContext('2d');
    
    // Parameters for the segments
    var graphYearStart = 1997;
    var graphYearEnd = 2015;
    var graphYearSubs = graphYearEnd-graphYearStart+1;
    var graphYearAngle = (1.9*Math.PI)/graphYearSubs;
    var graphYearAngleStart = 0.5*Math.PI;
    var graphYearAngleEnd = graphYearAngleStart+1.9*Math.PI;
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
    var segYearStart = 1997;
    var segYearEnd = 1998;
    var segStart = graphYearAngleStart+(segYearStart-graphYearStart)*graphYearAngle;
    var segEnd = graphYearAngleStart+(segYearEnd-graphYearStart)*graphYearAngle;

    // Segment width
    ctx.lineWidth = segWidth;
        
    // Initializing shadow before final rendering
    ctx.shadowBlur=20;
    ctx.shadowColor="black";
        
    // Drawing
    ctx.strokeStyle = segment;
    ctx.beginPath();
    ctx.arc(segCenterX,segCenterY,radius,segStart,segEnd,false);
    ctx.stroke();
        
}