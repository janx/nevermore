
$(document).ready(function() {
  Chart.defaults.global = {
      // Boolean - Whether to animate the chart
      animation: true,

      // Number - Number of animation steps
      animationSteps: 60,

      // String - Animation easing effect
      // Possible effects are:
      // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
      //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
      //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
      //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
      //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
      //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
      //  easeOutElastic, easeInCubic]
      animationEasing: "easeOutQuart",

      // Boolean - If we should show the scale at all
      showScale: true,

      // Boolean - If we want to override with a hard coded scale
      scaleOverride: false,

      // ** Required if scaleOverride is true **
      // Number - The number of steps in a hard coded scale
      scaleSteps: null,
      // Number - The value jump in the hard coded scale
      scaleStepWidth: null,
      // Number - The scale starting value
      scaleStartValue: null,

      // String - Colour of the scale line
      scaleLineColor: "rgba(0,0,0,.1)",

      // Number - Pixel width of the scale line
      scaleLineWidth: 1,

      // Boolean - Whether to show labels on the scale
      scaleShowLabels: true,

      // Interpolated JS string - can access value
      scaleLabel: "<%=value%>",

      // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
      scaleIntegersOnly: true,

      // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: false,

      // String - Scale label font declaration for the scale label
      scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

      // Number - Scale label font size in pixels
      scaleFontSize: 12,

      // String - Scale label font weight style
      scaleFontStyle: "normal",

      // String - Scale label font colour
      scaleFontColor: "#666",

      // Boolean - whether or not the chart should be responsive and resize when the browser does.
      responsive: false,

      // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio: true,

      // Boolean - Determines whether to draw tooltips on the canvas or not
      showTooltips: true,

      // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
      customTooltips: false,

      // Array - Array of string names to attach tooltip events
      tooltipEvents: ["mousemove", "touchstart", "touchmove"],

      // String - Tooltip background colour
      tooltipFillColor: "rgba(0,0,0,0.8)",

      // String - Tooltip label font declaration for the scale label
      tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

      // Number - Tooltip label font size in pixels
      tooltipFontSize: 14,

      // String - Tooltip font weight style
      tooltipFontStyle: "normal",

      // String - Tooltip label font colour
      tooltipFontColor: "#fff",

      // String - Tooltip title font declaration for the scale label
      tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

      // Number - Tooltip title font size in pixels
      tooltipTitleFontSize: 14,

      // String - Tooltip title font weight style
      tooltipTitleFontStyle: "bold",

      // String - Tooltip title font colour
      tooltipTitleFontColor: "#fff",

      // Number - pixel width of padding around tooltip text
      tooltipYPadding: 6,

      // Number - pixel width of padding around tooltip text
      tooltipXPadding: 6,

      // Number - Size of the caret on the tooltip
      tooltipCaretSize: 8,

      // Number - Pixel radius of the tooltip border
      tooltipCornerRadius: 6,

      // Number - Pixel offset from point x to tooltip edge
      tooltipXOffset: 10,

      // String - Template string for single tooltips
      tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

      // String - Template string for multiple tooltips
      multiTooltipTemplate: "<%= value %>",

      // Function - Will fire on animation progression.
      onAnimationProgress: function(){},

      // Function - Will fire on animation completion.
      onAnimationComplete: function(){}


  }

  var data = {
      labels: ["Trustworthiness", "History length", "Trustworthiness", "Provider reputation", "Trustworthiness"],
      datasets: [
          {
              label: "My Second dataset",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "#66afe9",
              pointColor: "#66afe9",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "#66afe9",
              data: [65, 59, 90, 81, 56]
          }
      ]
  }

  var options = {
      //Boolean - Whether to show lines for each scale point
      scaleShowLine : true,

      //Boolean - Whether we show the angle lines out of the radar
      angleShowLineOut : true,

      //Boolean - Whether to show labels on the scale
      scaleShowLabels : false,

      // Boolean - Whether the scale should begin at zero
      scaleBeginAtZero : true,

      //String - Colour of the angle line
      angleLineColor : "rgba(0,0,0,.1)",

      //Number - Pixel width of the angle line
      angleLineWidth : 1,

      //String - Point label font declaration
      pointLabelFontFamily : "'Arial'",

      //String - Point label font weight
      pointLabelFontStyle : "normal",

      //Number - Point label font size in pixels
      pointLabelFontSize : 10,

      //String - Point label font colour
      pointLabelFontColor : "#666",

      //Boolean - Whether to show a dot for each point
      pointDot : true,

      //Number - Radius of each point dot in pixels
      pointDotRadius : 3,

      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth : 1,

      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,

      //Boolean - Whether to show a stroke for datasets
      datasetStroke : true,

      //Number - Pixel width of dataset stroke
      datasetStrokeWidth : 2,

      //Boolean - Whether to fill the dataset with a colour
      datasetFill : true,

      //String - A legend template
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

  }

  var ctx = document.getElementById("myChart").getContext("2d")
  var myRadarChart = new Chart(ctx).Radar(data, options)
})
