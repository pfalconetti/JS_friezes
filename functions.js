function frieze() {
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
    var graphYearAngle = graphSize/graphYearSubs; // Angle occupied by one single year (-> distance between two markings-gaps), in radians
    var graphYearGap = 0.01; // Angle of the gap used to show the beginning/ending of a year (-> size of each marking), in radians /* FIXME PPF: pas très propre! */

    // Segments layout
    // These parameters define the global aspect of each segment in the graph
    var segRadiusMax = 150; // Max radius for all segments: they'll be displayed in a zone of segRadiusMax*2 per segRadiusMax*2 pixels
    var segRadialSubs = 8; // Number of radial subdivisions between the center and the outer border of all the graphs, strictly positive
    var segRadialWidth = segRadiusMax/segRadialSubs; // Width (-> thickness) of a single radial subdivision, in pixels
    var segWidthProportion = 2; // Segment width, in number of radial subdivisions, stricly positive
    var segWidth = segRadialWidth*segWidthProportion; // Width (-> thickness) of a segment, in pixels
    var segCenterX = 200; // Common X coordinate for the center of all the segments, in pixels
    var segCenterY = 200; // Common Y coordinate for the center of all the segments, in pixels

    // Segment width
    ctx.lineWidth = segWidth;

    // Drawing shadow for the complete length, before individual and final renderings
    /*
    var shadeStart = graphYearAngleStart; // Starting position of the combined shadow = starts where the first segment starts
    var shadeEnd = graphYearAngleStart+(graphYearEnd-graphYearStart)*graphYearAngle-graphYearGap; // Ending position of the shadow = ends where the last segment ends
    ctx.shadowBlur=20;
    ctx.shadowColor="black";
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.arc(segCenterX,segCenterY,radius,shadeStart,shadeEnd,false);
    ctx.stroke();
    ctx.closePath();
    */
        
    this.periode = function(yearBegin,yearEnd,level,colour,isShaded) {
        // Starting radial level for drawing the segment (= <= segRadialSubs - segWidthProportion)
        // yearBegin and yearEnd must be dcimals (not base 12)
        if (!yearEnd || yearEnd == "now") {
            yearEnd = dateToDecimal().toFixed(2);
        }
        
        // Segment individual properties
        var radius = segRadialWidth*level+segWidth/2+0.5; // Radius of an arc, in pixels (NB: "+0.5" is to ensure good aspect and covering)
        var segGradientRadiusStart = level*segRadialWidth; // Inner border of the segment gradient = starting point for radial gradient
        var segGradientRadiusEnd = (level+segWidthProportion)*segRadialWidth; // Outer border of the segment gradient = ending point for radial gradient
        var segment = ctx.createRadialGradient(segCenterX,segCenterY,segGradientRadiusStart,segCenterX,segCenterY,segGradientRadiusEnd); // Defining coloration method = gradient
        var colorLight = '#'+colour;
        var colorDark = colorLuminance(colour,-0.3);
        segment.addColorStop(0,colorLight); // Inner color for gradient
        if (isShaded) { // Outer color for gradient
            segment.addColorStop(1,colorDark);
        } else {
            segment.addColorStop(1,colorLight);
        }
        var segStart = graphYearAngleStart+(yearBegin-graphYearStart)*graphYearAngle; // Starting position of the segment
        var segFirstNewYear = graphYearAngleStart+(Math.ceil(yearBegin)-graphYearStart)*graphYearAngle; // Position of the first new-year-gap encountered by the segment
        var segEnd = graphYearAngleStart+(yearEnd-graphYearStart)*graphYearAngle; // Ending position of the segment

        // Drop shadow
        ctx.shadowBlur=20;
        ctx.shadowColor="black";
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(32,32,32,0.2)';
        ctx.arc(segCenterX,segCenterY,radius,segStart,segEnd,false);
        ctx.stroke();
        ctx.closePath();
        
        // Drawing multiple successive segments separated by years (final rendering)
        ctx.shadowBlur=0;
        // First arc, in case it is fractionnal
        ctx.beginPath();
        ctx.strokeStyle = segment;
        segEnd = segFirstNewYear-graphYearGap;
        if (segEnd-segStart < 0) { // keeping safe of negative values to prevent 360° of revolution
            segStart = segEnd;
        }
        ctx.arc(segCenterX,segCenterY,radius,segStart,segEnd,false);
        ctx.stroke();
        var segLastNewYear = segFirstNewYear;
        // All other intermediary arcs
        if (yearEnd-yearBegin >= 1) {
            for (i=0; i<(Math.floor(yearEnd)-Math.ceil(yearBegin)); i++) {
                ctx.beginPath();
                ctx.strokeStyle = segment;
                segEnd = segFirstNewYear+((i+1)*graphYearAngle-graphYearGap);
                ctx.arc(segCenterX,segCenterY,radius,segFirstNewYear+(i*graphYearAngle),segEnd,false);
                segLastNewYear = segFirstNewYear+((i+1)*graphYearAngle);
                ctx.stroke();
            }
        }
        // Last arc, in case it is fractionnal
        ctx.beginPath();
        ctx.strokeStyle = segment;
        if ((yearEnd-Math.floor(yearEnd))*graphYearAngle-graphYearGap < 0) { // keeping safe of negative values to prevent 360° of revolution
            segEnd = segLastNewYear;
        } else {
            segEnd = segLastNewYear+(yearEnd-Math.floor(yearEnd))*graphYearAngle-graphYearGap;
        }
        ctx.arc(segCenterX,segCenterY,radius,segLastNewYear,segEnd,false);
        ctx.stroke();
        ctx.closePath();
        
    } // end of method "periode()"

}

function colorLuminance(hex,lum) {
    // Found at http://www.sitepoint.com/javascript-generate-lighter-darker-color/
	// Validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	// Convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i=0; i<3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

function dateToDecimal() {
    var ladate = new Date();
    var result = ladate.getFullYear() + ((ladate.getMonth()+1)/12) + (ladate.getDate()/31/12);
    return result;
}