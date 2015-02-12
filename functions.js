function arcSegment() {
    // Angles are expressed in radians.
    // Complete revolution = 360° = 2*Math.PI radians
    // E cardinal point = 0.0*Math.PI radians
    // S cardinal point = 0.5*Math.PI radians
    // W cardinal point = 1.0*Math.PI radians
    // N cardinal point = 1.5*Math.PI radians
    // arc(.,.,.,.,.,true) = counterclockwise
    // arc(.,.,.,.,.,false) = clockwise
    
    // Standard initialization of the canvas
    var can = document.getElementById('myCanvas');
    var ctx = can.getContext('2d');
    
    // Parameters for the segments
    // These parameters define the global aspect of the graph where the segments will be drawn
    var graphYearStart = 1997; // Starting year of the first segment
    var graphYearEnd = 2015; // Ending year for the last segment, must be superior to graphYearStart
    var graphYearSubs = graphYearEnd-graphYearStart+1; // Markings between the starting year and the ending year (= number of years + 1), at least 2
    var graphYearAngleStart = 0.5*Math.PI; // Position where we start drawing the graph (0.5*Math.PI = S cardinal point), in radians
    var graphSize = 1.9*Math.PI; // Total length of the graph (2*Math.PI = complete revolution), in radians
    var graphYearAngleEnd = graphYearAngleStart+graphSize; // Position where we end drawing the graph, in radians
    var graphYearAngle = graphSize/graphYearSubs; // Angle occupied by one single year (-> distance between two markings), in radians
    var graphYearGap = 0.02; // Angle of the gap used to show the beginning/ending of a year (-> size of each marking), in radians

    // Segments layout
    // These parameters define the global aspect of each segment in the graph
    var segRadiusMax = 150; // Max radius for all segments: they'll be displayed in a zone of segRadiusMax*2 per segRadiusMax*2 pixels
    var segRadialSubs = 8; // Number of radial subdivisions between the center and the outer border of all the graphs, strictly positive
    var segRadialWidth = segRadiusMax/segRadialSubs; // Width (-> thickness) of a single radial subdivision, in pixels
    var segWidthProportion = 2; // Segment width, in number of radial subdivisions, stricly positive
    var segWidth = segRadialWidth*segWidthProportion; // Width (-> thickness) of a segment, in pixels
    var segCenterX = 200; // Common X coordinate for the center of all the segments, in pixels
    var segCenterY = 200; // Common Y coordinate for the center of all the segments, in pixels

    // Segment individual properties
    var segLevel = 6; // Starting radial level for drawing the segment (= <= segRadialSubs - segWidthProportion)
    var radius = segRadialWidth*segLevel+segWidth/2+0.5; // Radius of an arc, in pixels (NB: "+0.5" is to ensure good aspect and covering)
    var segGradientRadiusStart = segLevel*segRadialWidth; // Inner border of the segment gradient = starting point for radial gradient
    var segGradientRadiusEnd = (segLevel+segWidthProportion)*segRadialWidth; // Outer border of the segment gradient = ending point for radial gradient
    var segment = ctx.createRadialGradient(segCenterX,segCenterY,segGradientRadiusStart,segCenterX,segCenterY,segGradientRadiusEnd); // Defining coloration method = gradient
    //segment.addColorStop(0,'#f00'); // Inner color for gradient
    //segment.addColorStop(1,'#900'); // Outer color for gradient
    segment.addColorStop(0,'#fff'); // Inner color for gradient /* FIXME PPF temporary colour */
    segment.addColorStop(1,'#fff'); // Outer color for gradient /* FIXME PPF temporary colour */
    var segYearStart = 1997.5; // Starting of the segment (fraction is decimal, not base 12) /* FIXME PPF */
    var segYearEnd = 2013.5; // Ending of the segment (fraction is decimal, not base 12) /* FIXME PPF */
    var segStart = graphYearAngleStart+(segYearStart-graphYearStart)*graphYearAngle; // Starting position of the segment
    var segFirstNewYear = graphYearAngleStart+(Math.ceil(segYearStart)-graphYearStart)*graphYearAngle; // Position of the first new-year-gap encountered by the segment




    var segEnd = graphYearAngleStart+(segYearEnd-graphYearStart)*graphYearAngle;
    var shadeStart = graphYearAngleStart; // Starting position of the combined shadow = starts where the first segment starts
    var shadeEnd = graphYearAngleStart+(graphYearEnd-graphYearStart)*graphYearAngle-graphYearGap; // Ending position of the shadow = ends where the last segment ends
    
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
    ctx.arc(segCenterX,segCenterY,radius,segStart,segFirstNewYear-graphYearGap,false);
    ctx.stroke();
    // All other intermediary arcs
    for (i=0; i<(segYearEnd-segYearStart-2); i++) {
        ctx.beginPath();
        ctx.strokeStyle = segment;
        ctx.arc(
            segCenterX,
            segCenterY,
            radius,
            segFirstNewYear+(i*graphYearAngle),
            segFirstNewYear+((i+1)*graphYearAngle-graphYearGap),
            false
        );
        var segLastNewYear = segFirstNewYear+((i+1)*graphYearAngle);
        ctx.stroke();
    }
    // Last arc, in case it is fractionnal
    ctx.beginPath();
    ctx.strokeStyle = segment;
    ctx.arc(segCenterX,segCenterY,radius,segLastNewYear,(segYearEnd-Math.floor(segYearEnd))*graphYearAngle-graphYearGap,false);
    ctx.stroke();
    //ctx.closePath();

}