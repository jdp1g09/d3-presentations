var fData = [
		{"tranid" : "BUGA", "taskCount" : 300, "speed" : 10},
		{"tranid" : "ASTO", "taskCount" : 300, "speed" : 30},
		{"tranid" : "ASTO", "taskCount" : 300, "speed" : 35},
		{"tranid" : "JAGU", "taskCount" : 100, "speed" : 20},
		{"tranid" : "TRN1", "taskCount" : 300, "speed" : 26},
		{"tranid" : "TRN2", "taskCount" : 200, "speed" : 16},
		{"tranid" : "TRN3", "taskCount" : 300, "speed" : 5}
];

var fData2 = [
 		{"tranid" : "BUGA", "taskCount" : 300, "speed" : 15},
 		{"tranid" : "ASTO", "taskCount" : 300, "speed" : 35},
 		{"tranid" : "ASTO", "taskCount" : 300, "speed" : 40},
 		{"tranid" : "JAGU", "taskCount" : 100, "speed" : 25}
];
 
var nodes = [{label: "CICSAOR1", x: 270, y: 0},{label: "CICSAOR2", x: 230, y: 140},
             {label: "CICSAOR3", x: 0, y: 120},{label: "CICSAOR4", x: 180, y: 270},
             {label: "CICSTOR1", x: 180, y: 0},{label: "CICSTOR2", x: 150, y: 400},
             {label: "CICSTOR3", x: 0, y: 150},{label: "CICSTOR4", x: 300, y: 400},
             {label: "CICSFOR1", x: 64, y: 173},{label: "CICSFOR2", x: 200, y: 100}];

var links = [{"from": 0, "to": 1, "time" : 900, "data" : fData2},{"from": 0, "to": 2, "time" : 100, "data" : fData},
             {"from": 1, "to": 0, "time" : 750, "data" : fData2},{"from": 4, "to": 3, "time" : 1500, "data" : fData},
             {"from": 0, "to": 3, "time" : 1900, "data" : fData2},{"from": 1, "to": 2, "time" : 500, "data" : fData},
             {"from": 1, "to": 3, "time" : 500, "data" : fData2},{"from": 3, "to": 5, "time" : 900, "data" : fData},
             {"from": 3, "to": 8, "time" : 300, "data" : fData2},{"from": 5, "to": 6, "time" : 700, "data" : fData},
             {"from": 6, "to": 7, "time" : 2000, "data" : fData2},{"from": 6, "to": 8, "time" : 1300, "data" : fData},
             {"from": 7, "to": 9, "time" : 3000, "data" : fData2},{"from": 8, "to": 9, "time" : 1900, "data" : fData}];
             

var paths = [];

var width = 600,
	height = 600,
	padding = 50;
	
var scaleX = d3.scale.linear()
	.domain([d3.min(nodes,function(d){return d.x;}), d3.max(nodes,function(d){return d.x;})])
	.range([0, width], 1);

var scaleY = d3.scale.linear()
	.domain([d3.min(nodes,function(d){return d.y;}), d3.max(nodes,function(d){return d.y;})])
	.range([0, width], 1);
	
//rect size
var nodecfg = {
		width : 90,
		height : 25
};
            
function NetworkChart(){
	network = function(data_nodes, data_links){
		chart = d3.select("#netChart");

		// set x and y coordinates of each link based on index of node
		data_links.forEach(function(d) {
		    d.from = data_nodes[d.from];
		    d.to = data_nodes[d.to];
		    path = new Array(d.from,d.to);
		    paths.push(path);
		  });
		
		var links = chart.append("g")
		      .attr("class", "links");
		
		var lines = links.append("g").attr("class","lines").selectAll("line").data(data_links);
		
		var link = lines.enter().append("path")
			  .attr("class","link")
			  .attr("x1", function(d,i) { 
				  return paths[i][0].x;
		      })
		      .attr("x2", function(d,i) { 
				  return paths[i][1].x;
		      })
		      .attr("y1", function(d,i) { 
				  return paths[i][0].y;
		      })
		      .attr("y2", function(d,i) { 
				  return paths[i][1].y;
		      })
		      .attr("lineID", function(d,i) { 
				  return i;
		      })
              .attr("d", function(d,i) { 
            	  return lineToPath(paths[i]); 
              });
		
        link.on("click",function(d,i){
        	var l = d3.select(this);
        	var x1 = parseInt(l.attr("x1")),
        		x2 = parseInt(l.attr("x2")),
        		y1 = parseInt(l.attr("y1")),
        		y2 = parseInt(l.attr("y2"));
        	l_center = [(x2+x1)/2,(y2+y1)/2];
        	angle = coords2bearing(x1,y1,x2,y2);
        	console.log(d.data);
        	console.log(d.from.label + " to " + d.to.label);
        	scale = 30;
			var cXunscaled = width/2,
				cX = cXunscaled/scale;
			var cYunscaled = height/2,
				cY = cYunscaled/scale;
			tX = cX-scaleX(l_center[0])+(padding/scale);
			tXunscaled = cXunscaled-scaleX(l_center[0])+(padding);
			tY = cY-scaleY(l_center[1])+(padding/scale);
			tYunscaled = cYunscaled-scaleY(l_center[1])+(padding);
			chart.attr("tX",tX);
			chart.attr("tY",tY);
			chart.attr("tXu",tXunscaled);
			chart.attr("tYu",tYunscaled);
			chart.attr("cX",scaleX(l_center[0]));
			chart.attr("cY",scaleY(l_center[1]));
			
			chart.transition().duration(1000)
				.attr("transform","translate("+tXunscaled+","+tYunscaled+")rotate("+(-1*angle)+","+scaleX(l_center[0])+","+scaleY(l_center[1])+")")
				.transition().delay(1000).duration(1000)
				.attr("transform","scale("+scale+")translate("+tX+","+tY+")rotate("+(-1*angle)+","+scaleX(l_center[0])+","+scaleY(l_center[1])+")")
				.each("end",function(){
					fChart.show(d.data);
					nChart.pauseTransition();
					fChart.showBlocks(d);
					d3.select("#netChart").transition().duration(1000)
						.style("opacity",0);
				});
		});
		
		link.on('mouseover', function() {
			  d3.select(this).style('stroke-width', 5);
			  d3.select(this).style('stroke', "red");
		});
		
		// Set the stroke width back to normal when mouse leaves the node.
		link.on('mouseout', function() {
		  link.style('stroke-width', 1);
		  link.style('stroke', "#999");
		  tooltip.style("visibility", "hidden");
		});
		
		var markers = links.append("g").attr("class","markers").selectAll("circle").data(data_links);
		
		var marker = markers.enter().append("circle")
			  .style("fill","black")
			  .attr("r", 2)
			  .attr("cx", function(d) { return scaleX(d.from.x); })
			  .attr("cy", function(d) { return scaleY(d.from.y); })
			  .transition()
			  .duration(function(d) { return d.time; })
			  .ease("linear")
			  .each(slide);

		var nodes = chart.append("g").attr("class","nodes").selectAll("circle")
			.data(data_nodes);

		node = nodes.enter().append("g")
			.attr("class","node")
			.attr("transform", function(d){
				var tX = scaleX(d.x)-nodecfg.width/2;
				var tY = scaleY(d.y)-nodecfg.height/2;
				d3.select(this).attr("tX",tX);
				d3.select(this).attr("tY",tY);
	        	return "translate(" + tX + "," + tY + ")";
	        })
			.call(d3.behavior.drag()
		        .origin(function(d) { return d; })
		        .on("drag", function(d, i) {
		          evnt = d3.event;
		          var tX = parseInt(d3.select(this).attr("tX"))+evnt.dx;
		          var tY = parseInt(d3.select(this).attr("tY"))+evnt.dy;
		          d.x = scaleX.invert(tX + nodecfg.width/2); d.y = scaleY.invert(tY + nodecfg.height/2);
		          d3.select(this).attr("tX",tX);
		          d3.select(this).attr("tY",tY);
		          d3.select(this).attr("transform", function(d){
			        	return "translate(" + (tX ) + "," + (tY ) + ")";
			      });
		          //link.filter(function(l) { return l.from === d; }).attr("x1", d.x).attr("y1", d.y);
		          //link.filter(function(l) { return l.to === d; }).attr("x2", d.x).attr("y2", d.y);
		          
		          p = paths.filter(function(p) { return p[0] === d; });
		          p.forEach(function(p_d){
		        	  p_d[0] = d;
		          });
		          
		          p = paths.filter(function(p) { return p[1] === d; });
		          p.forEach(function(p_d){
		        	  p_d[1] = d;
		          });
		          
		          link.attr("coords", function(d,i) { return paths[i]; })
		          	.attr("x1", function(d,i) { 
						return paths[i][0].x;
				    })
				    .attr("x2", function(d,i) { 
						return paths[i][1].x;
				    })
				    .attr("y1", function(d,i) { 
						return paths[i][0].y;
				    })
				    .attr("y2", function(d,i) { 
						return paths[i][1].y;
				    })
		          	.attr("d", function(d,i) { return lineToPath(paths[i]); });	
		          tooltip.html("Node: " + i + "<br>" + "Coordinates: (" + parseInt(d.x) + "," + parseInt(d.y) + ")");
		        }));;
		
		node.append("rect")
			.attr("width", nodecfg.width)
			.attr("height", nodecfg.height);
		
		node.append("text")
			.attr("x", nodecfg.width/2)
			.attr("y", nodecfg.height*0.7)
			.style("line-height", nodecfg.height)
			.style("text-anchor", "middle")
			.text(function(d){return d.label});
		
		nodes.on('mouseover', function(d , i) {
			  d3.select(this).attr("r",6);
			  link.style('stroke-width', function(l) {
			    if (d === l.from || d === l.to)
			      return 2;
			    else
			      return 1;
			  });
			  link.style('stroke', function(l) {
			    if (d === l.from || d === l.to)
			      return "red";
			    else
			      return "#999";
			  });
			  tooltip.style("visibility", "visible");
			  tooltip.html("Node: " + i + "<br>" + "Coordinates: (" + parseInt(d.x) + "," + parseInt(d.y) + ")");
			});
		
		nodes.on("mousemove", function() {
			return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		});
		
		// Set the stroke width back to normal when mouse leaves the node.
		nodes.on('mouseout', function() {
		  link.style('stroke-width', 1);
		  link.style('stroke', "#999");
		  tooltip.style("visibility", "hidden");
		});
		
		var tooltip = d3.select("body")
			.append("div")
			.attr("class","tooltip")
			.text("a simple tooltip");
	};
	
	network.play = true;
	
	network.playTransition = function(){
		network.play = true;
		var markers = d3.selectAll("circle")
			  .each(slide);
	};

	network.pauseTransition = function(){
		network.play = false;
	};
	
	function slide(d) {
	  var circle = d3.select(this);
	  network.play = true;
	  (function repeat() {
		  if (network.play){
			  circle = circle.transition()
		    	.duration(function(d) { return 2*d.time; })
		    	.ease("linear")
		        .attr("cx", function(d){return scaleX(d.to.x);})
		        .attr("cy", function(d){return scaleY(d.to.y);})
		       .transition()
		       .duration(10)
		        .attr("cx", function(d){return scaleX(d.from.x);})
		        .attr("cy", function(d){return scaleY(d.from.y);})
		        .each("end", repeat);
		  }
	  })();
	}
	
	return network;
}

var lineToPath = d3.svg.line()
	.x(function(d,i) {return scaleX(d.x);})                         
	.y(function(d,i) {return scaleY(d.y);})
	.interpolate("cardinal");

	function rad2deg(angle){
	return angle * 57.29577951308232;
}


function deg2rad(angle){
	return angle / 57.29577951308232;
}

function coords2bearing(x1,y1,x2,y2){
	x1 = scaleX(x1);
	x2 = scaleX(x2);
	y1 = scaleY(y1);
	y2 = scaleY(y2);
	var bearing = 0;
	if (x1<x2){
		//1 is bottom-left of 2 (flow going up to right)
		if (y1 > y2){
			bearing = rad2deg(Math.atan((x2-x1)/(y1-y2)));
			console.log("flow up-right");
		} 
		//1 is top-left of 2 (flow going down to right)
		else if (y2 > y1){
			bearing = 180 - rad2deg(Math.atan((x2-x1)/(y2-y1)));
			console.log("flow down-right");
		} 
		// straight line flow (left to right)
		else {
			bearing = 90;
			console.log("flow right");
		}
	} else if (x2<x1) {
		//1 is bottom-right of 2  (flow going up to left)
		if (y1 > y2){
			bearing = 270 + rad2deg(Math.atan((y1-y2)/(x1-x2)));
			console.log("flow up-left");
		} 
		//1 is top-right of 2  (flow going down to left)
		else if (y2 > y1){
			bearing = 180 + rad2deg(Math.atan((x1-x2)/(y2-y1)));
			console.log("flow down-left");
		}
		// straight line flow (right to left)
		else {
			bearing = -90;
			console.log("flow left");
		}
	} else {
		//1 is below 2  (flow going up)
		if (y1 > y2){
			bearing = 0;
			console.log("flow up");
		} 
		//1 is above 2  (flow going down)
		else if (y2 > y1){
			bearing = 180;
			console.log("flow down");
		}
	}
	// correct such that line is perpendicular
	bearing = bearing - 90;
	//bearing = (bearing>180) ? bearing - 360 : bearing;
	
	return bearing;
}

function FlowChart(){
	var scale_height, scale_speed, scale_color;
	var flowcfg;
	
	// Constructor
	var flow = function(data){
		// Configuration Parameters
		var minSpeed = d3.min(data,function(d){return d.speed;});
		var maxSpeed = d3.max(data,function(d){return d.speed;});
		var taskCountSum = d3.sum(data,function(d){return d.taskCount;});
		scale_height = d3.scale.linear()
			.domain([0, d3.max(data,function(d){return d.taskCount;})])
			.range([0, 200], 1);
		scale_speed = d3.scale.linear()
			.domain([minSpeed, maxSpeed])
			.range([5, 20], 1);
		scale_color = d3.scale.linear()
			.domain([minSpeed, (maxSpeed + minSpeed) / 2,  maxSpeed])
			.range(["red","orange","green"]);
		flowcfg = {
			sizes : {
				width : 600,
				height : 400, 
				flowMargin : 30, 
				segments : 5, 
				lineSize : 50, 
				lineWidth : "5px",
				speedOffset : 2, 
				maxOpacity : 0.6
			},
			arrays : {
				vectorBounds : [], 
				vectorField : [], 
				opacities : []
			},
			rgnBlocks : {
				padding : 40,
				width: 100
			}
		};
		
		for (var i=0 ; i<flowcfg.sizes.segments ; i++){
			flowcfg.arrays.opacities.push((i+1)*(flowcfg.sizes.maxOpacity/flowcfg.sizes.segments));
		}
		
		// Construction starts
		var transform = "translate(0,"+(((height+2*padding) - flowcfg.sizes.height)/2)+")";
		var chart = d3.select("#flowChart");
		chart.attr("transform",transform).style("opacity",0).style("display","none");
		
		d3.select("#flowBackground").attr("y",((height+2*padding)/2));
		
		var offset = 0;
		// calculate vector field data
		var vFieldRects = chart.selectAll(".vFieldRect").data(data)
			.enter().append("rect").attr("class","vFieldRect")
			.attr("width",(width+2*padding))
			.attr("height",function(d){return flowcfg.sizes.height*(d.taskCount/taskCountSum);})
			.style("stroke","black")
			.attr("transform",function(d){
					var translate = "translate(0,"+offset+")";
					offset = offset + flowcfg.sizes.height*(d.taskCount/taskCountSum);
					return translate;
			})
			.style("fill",function(d){return scale_color(d.speed);})
			.style("opacity","0.4");
		
		// construct region blocks for each end of the flow
		d3.select("#rgnBlocks").attr("transform",transform)
			.append("g").attr("class", "fromRgn")
			.attr("transform","translate("+(-flowcfg.rgnBlocks.width-10)+","+(-flowcfg.rgnBlocks.padding)+")")
			.attr("transformHide","translate("+(-flowcfg.rgnBlocks.width-10)+","+(-flowcfg.rgnBlocks.padding)+")")
			.attr("transformShow","translate(0,"+(-flowcfg.rgnBlocks.padding)+")")
			.append("rect").attr("class","fromRgnRect")
			.attr("width",flowcfg.rgnBlocks.width).attr("height",(flowcfg.sizes.height+2*flowcfg.rgnBlocks.padding));
		
		var textYOffset = (flowcfg.sizes.height+2*flowcfg.rgnBlocks.padding)/2;
		d3.selectAll(".fromRgn").append("text")
			.text("From Region").attr("class", "rgnLabel")
			.style("text-anchor", "middle")
			.attr("transform", "translate(" + flowcfg.rgnBlocks.width*0.6 + ", "+textYOffset+")rotate(-90)")
		
		d3.select("#rgnBlocks")
			.append("g").attr("class", "toRgn")
			.attr("transform","translate("+(width+2*padding+10)+","+(-flowcfg.rgnBlocks.padding)+")")
			.attr("transformHide","translate("+(width+2*padding+10)+","+(-flowcfg.rgnBlocks.padding)+")")
			.attr("transformShow","translate("+(width+2*padding-flowcfg.rgnBlocks.width)+","+(-flowcfg.rgnBlocks.padding)+")")
			.append("rect").attr("class","toRgnRect")
			.attr("width",flowcfg.rgnBlocks.width).attr("height",(flowcfg.sizes.height+2*flowcfg.rgnBlocks.padding));
		
		d3.selectAll(".toRgn").append("text")
			.text("To Region").attr('class', 'rgnLabel')
			.style("text-anchor", "middle")
			.attr("transform", "translate(" + flowcfg.rgnBlocks.width*0.45 + ", "+textYOffset+")rotate(90)")
	};
	
	flow.show = function(data){
		console.log("show");
		var chart = d3.select("#flowChart");
		var taskCountSum = d3.sum(data,function(d){return d.taskCount;});
		var offset = 0;

		// exit vector fields - delete any rectangles that no longer exist in data set
		vFieldRects = chart.selectAll(".vFieldRect").data(data).exit().remove();
		
		// enter vector fields - append any rectangles for new data
		var vFieldRects = chart.selectAll(".vFieldRect").data(data)
			.enter().append("rect").attr("class","vFieldRect")
			.attr("width",(width+2*padding))
			.attr("height",function(d){return flowcfg.sizes.height*(d.taskCount/taskCountSum);})
			.style("stroke","black")
			.attr("transform",function(d){
					var translate = "translate(0,"+offset+")";
					offset = offset + flowcfg.sizes.height*(d.taskCount/taskCountSum);
					return translate;
			})
			.style("fill",function(d){return scale_color(d.speed);})
			.style("opacity","0.4");
		
		offset = 0;
		// update vector field data
		var vFieldRects = chart.selectAll(".vFieldRect").data(data)
			.attr("width",(width+2*padding)).attr("class","vFieldRect")
			.attr("height",function(d){return flowcfg.sizes.height*(d.taskCount/taskCountSum);})
			.style("stroke","black")
			.attr("transform",function(d){
					var translate = "translate(0,"+offset+")";
					offset = offset + flowcfg.sizes.height*(d.taskCount/taskCountSum);
					return translate;
			})
			.style("fill",function(d){return scale_color(d.speed);})
			.style("opacity","0.4");

		flowcfg.arrays.vectorBounds = [];
		offset = 0;
		//flowcfg.arrays.vectorBounds = [];
		for(var r=0, rect;rect=vFieldRects[0][r];r++){
			d = d3.select(rect).data()[0];
			var vData = {
					minX : -flowcfg.sizes.flowMargin,
					maxX : flowcfg.sizes.width,
					minY : offset,
					maxY : offset + parseFloat(rect.getAttribute("height")),
					speed : d.speed,
					name : d.tranid
			};
			flowcfg.arrays.vectorBounds.push(vData);
			offset += parseFloat(rect.getAttribute("height"));	
		}
				
		var back = d3.select("#flowBackground");
		back.transition().duration(1000).attr("height",flowcfg.sizes.height)
			.attr("y",(((height+2*padding) - flowcfg.sizes.height)/2));
		
		back.transition().delay(1000).duration(500).attr("height",flowcfg.sizes.height)
			.style("fill","white").style("stroke","black").style("stroke-width","2px");
		
		var chart = d3.select("#flowChart");
		chart.style("display","block").transition().delay(1000).duration(1000)
			.style("opacity",1);
		//flowcfg.arrays.vectorField = [];
		fChart.visualiseFields(750);
		fChart.playTransition();
	}
	
	flow.showBlocks = function(link){
		d3.select(".toRgn")
			.transition().delay(750).duration(1000)
			.attr("transform",d3.select(".toRgn").attr("transformShow"))
			.select("text").text(link.to.label);
		d3.select(".fromRgn")
			.transition().delay(750).duration(1000)
			.attr("transform",d3.select(".fromRgn").attr("transformShow"))
			.select("text").text(link.from.label)
	}
	
	flow.hideBlocks = function(){
		d3.select(".toRgn")
			.transition().duration(1000)
			.attr("transform",d3.select(".toRgn").attr("transformHide"));
		d3.select(".fromRgn")
			.transition().duration(1000)
			.attr("transform",d3.select(".fromRgn").attr("transformHide"));
	}
	
	flow.hide = function(){
		var chart = d3.select("#flowChart");
		chart.transition().duration(1000)
			.style("opacity",0)
			.each("end",function(){
				d3.select(this).style("display","none");
			});
		
		var back = d3.select("#flowBackground");
		back.transition().delay(1000).duration(800).attr("height",0)
			.style("fill","rgb(155,155,155)").style("stroke","rgb(155,155,155)")
			.attr("y",((height+2*padding)/2));
	}
	
	flow.visualiseFields = function(points){
		console.log("vis");
		var x,y;
		flowcfg.arrays.vectorField = [];
		for (var p = 0 ; p < points ; p++){
			x = parseInt(((width+2*padding)+flowcfg.sizes.flowMargin)*Math.random()-flowcfg.sizes.flowMargin);
			y = parseInt(flowcfg.sizes.height*Math.random());
			flow.appendVector(x,y);
		}
		plotVectorField();
	}
	
	flow.appendVector = function(x, y){
		if (x>(width+2*padding)||y>flowcfg.sizes.height){
			throw "Coordinates outside of svg boundaries, please define co-ordinates within [0,0] and ["+width+","+height+"]";
		}
		
		var speed = getSpeedForY(y);
		var vect = {
				x : x,
				y : y,
				v : speed
		};
		flowcfg.arrays.vectorField.push(vect);
	}
	
	flow.updateVectorField = function(){
		flowcfg.arrays.vectorField.forEach(function(d, i){
			flowcfg.arrays.vectorField[i].v = getSpeedForY(d.y);
		})
	}
	
	flow.play = true;

	flow.playTransition = function(){
		play = true;
		var flowChart = d3.select("#flowChart");
		var lines = flowChart.selectAll("g").data(flowcfg.arrays.vectorField);
		console.log(flowcfg.arrays.vectorField);
		lines.style("fill",function(d){
				return scale_color(d.v);
			})
			.attr("y", function(d){
				return d.y;
			})
			.attr("transform",function(d, i) {
				return "translate(" + this.getAttribute("x") + "," + this.getAttribute("y")+ ")"
			});
			
		lines.transition().duration(function(d){
				return 100*((width+2*padding)+flowcfg.sizes.flowMargin-d.x)/(scale_speed(d.v));
			}).ease("linear")
			.attr("transform",function(d, i) {
				var translateX = (width+2*padding)  + flowcfg.sizes.flowMargin;
				return "translate(" + translateX + "," + this.getAttribute("y")+ ")"
			})
			.each("end",restartFlow);
	}

	flow.pauseTransition = function(){
		play = false;
	}

	function restartFlow(){
		if (play){
			var line = d3.select(this);
			line.attr("transform",function(d, i) {
					return "translate(-50," + this.getAttribute("y")+ ")";
				})
				.attr("x",-50)
				.transition().duration(function(d){
					var ff = (Math.random()*0.2)+0.9;
					return 100*ff*((width+2*padding)+flowcfg.sizes.flowMargin)/(scale_speed(d.v));
				}).ease("linear")
				.attr("transform",function(d, i) {
					var translateX = (width+2*padding)  + flowcfg.sizes.flowMargin;
					return "translate(" + translateX + "," + this.getAttribute("y")+ ")";
				})
				.each("end", restartFlow);
		}
	}
	
	function getSpeedForY(y){
		var res = d3.selectAll(flowcfg.arrays.vectorBounds)[0].filter(function(d){
			if((y>=d.minY)&&(y<=d.maxY)){
				return true;
			} else {
				return false;
			}
		});
		return res[0].speed;
	}
	
	function plotVectorField(){
		var flowChart = d3.select("#flowChart");
		flowChart.on("click",function(){
			resetView();
		});
		// update
		flowChart.selectAll("g").data(flowcfg.arrays.vectorField)
			.enter().append("g")
			.attr("width",flowcfg.sizes.lineSize)
			.attr("height",parseInt(flowcfg.sizes.lineWidth))
			.attr("x",function(d){return d.x;})
			.attr("y",function(d){return d.x;})
			.attr("transform", function(d) { 
				return "translate(" + d.x + "," + d.y + ")";
			})
			.selectAll("line").data(flowcfg.arrays.opacities)
			.enter().append("line")
			.attr("x1",function(d,i){return (i)*flowcfg.sizes.lineSize/flowcfg.sizes.segments})
			.attr("x2",function(d,i){return (i+1)*flowcfg.sizes.lineSize/flowcfg.sizes.segments})
			.attr("y1",0)
			.attr("y2",0)
			.style("stroke",function(d){return scale_color(d3.select(this.parentElement).data()[0].v);})
			.style("fill",function(d){return scale_color(d3.select(this.parentElement).data()[0].v);})
			.style("stroke-width",flowcfg.sizes.lineWidth)
			.style("opacity",function(d,i){return d;});
		
		flowChart.selectAll("g").data(flowcfg.arrays.vectorField)
			.attr("x",function(d){return d.x;})
			.attr("y",function(d){return d.x;})
			.attr("transform", function(d) { 
				return "translate(" + d.x + "," + d.y + ")";
			})
			.selectAll("line")
				.attr("x1",function(d,i){return (i)*flowcfg.sizes.lineSize/flowcfg.sizes.segments})
				.attr("x2",function(d,i){return (i+1)*flowcfg.sizes.lineSize/flowcfg.sizes.segments})
				.attr("y1",0)
				.attr("y2",0)
				.style("stroke",function(d){return scale_color(d3.select(this.parentElement).data()[0].v);})
				.style("fill",function(d){return scale_color(d3.select(this.parentElement).data()[0].v);})
				.style("stroke-width",flowcfg.sizes.lineWidth)
				.style("opacity",function(d,i){return d;});
	}
	return flow;
}

function renderFlowChart(parent){
	svgg = parent.append("g")
		    .attr("width", width + padding + padding)
		    .attr("height", height + padding + padding);

	svgg.append("g")
	    .attr("id", "netChart")
	    .attr("transform", "translate(" + padding + "," + padding + ")");

	nChart = new NetworkChart();
	nChart(nodes,links);
	
	// create a rectangle that will cover the network chart when viewing flow
	// +10 on width and -5 for x is so that the border only show at the top and the bottom
	svgg.append("rect")
	    .attr("id", "flowBackground")
	    .attr("width",width+2*padding+10).attr("height",0).style("fill","rgb(153, 153, 153)")
	    .attr("x",-5).attr("y",height/2);
	
	svgg.append("g")
	    .attr("id", "flowChart")
	    .attr("transform", "translate(" + padding + "," + padding + ")");
	
	svgg.append("g")
	    .attr("id", "rgnBlocks")
	    .attr("transform", "translate(" + padding + "," + padding + ")");

	fChart = new FlowChart();
	fChart(fData,"translate(50,50)");
}

function resetView(){
	fChart.hideBlocks();
	d3.select('#netChart')
		.transition().duration(1000)
		.style("opacity",1);
	d3.select('#netChart')
		.transition().delay(1500).duration(3000)
		.attr('transform','scale(1)translate('+d3.select('#netChart').attr("tXu")+','+d3.select('#netChart').attr("tYu")+')')
		.transition().delay(2500).duration(1000)
		.attr('transform','scale(1)translate(50,50)')
	fChart.hide();
	nChart.playTransition();
}