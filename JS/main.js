var svgContainer = ".svg-container";
var pathData = [
    [
        {x: 20, y:30},
        {x: 20, y:90},
        {x: 80, y:90},
        {x: 80, y:120},
        {x: 50, y:120},
        {x: 50, y:70},
        {x: 40, y:70}
    ],
    [
        {x: 120, y:230},
        {x: 120, y:290},
        {x: 180, y:290},
        {x: 180, y:320},
        {x: 150, y:320},
        {x: 150, y:270},
        {x: 140, y:270}
    ]
]

$(function(){
    new Diagram(svgContainer,pathData);
})