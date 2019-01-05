(function() {
    'use strict';

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    
    var audioElement = document.getElementById('audioElement');
    audioElement.crossOrigin = "anonymous";


    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    var frequencyData = new Uint8Array(200);

    var svgHeight = 600,
        svgWidth = 960;

    var svg = d3.select('body').append('svg')
        .attr({
            height: svgHeight,
            width: svgWidth
        });

    function renderChart() {
        requestAnimationFrame(renderChart);

        analyser.getByteFrequencyData(frequencyData);

        var radiusScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, svgHeight/2 -10]);

        var hueScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 360]);

       var circles = svg.selectAll('circle')
           .data(frequencyData);

        circles.enter().append('circle');

        circles
            .attr({
                r: function(d) { return radiusScale(d); },
                cx: svgWidth / 2,
                cy: svgHeight / 2,
                fill: 'none', 
                'stroke-width': 4,
                'stroke-opacity': 0.4,
                stroke: function(d) { return d3.hsl(hueScale(d), 1, 0.10); }
           });

        circles.exit().remove(); 
    }

    renderChart();

    d3.select(self.frameElement).style('height', '700px');

}());