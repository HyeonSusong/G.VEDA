var  Diagram = (function(Diagram){
    function Diagram(target,data){
        this.data = data;
        this.canvas = target;
        this.height = 1024;
        this.width = 1920;
        this.zIndex = -10;
        this.init();
    }
    return Diagram;
})(Diagram || {})

var dia = Diagram.prototype;

dia.init = function(){
    this.svg = d3.select(this.canvas)
    .append("svg")
    .attr("id", "main-svg")
    .attr("width",this.width)
    .attr("height",this.height);
    this.topLevelG = this.svg.append("g")
    .attr("class","top-level-g");
    this.setLine();
    this.setPulse();
}

dia.setLine = function(){

    var g = this.topLevelG.append("g")
    .attr("class","path-g")
    var dia = this;
    $.each(dia.data,function(idx,path){
        dia.drawLine(g,path);
    });
}

dia.drawLine = function(g,path){
    var lineFunction = d3.line()
    .x(function(d){
        return Number(d.x);				
    })
    .y(function(d){
        return Number(d.y);
    });
    //.curve(d3.curveBasis);
    g.append("path")
    .attr("class","electric-path")
    .data(path)
    .attr("d",lineFunction(path));

}

dia.setPulse = function(){
    
}

dia.drawPulse = function(){

}
