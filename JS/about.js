
var History = (function(History){
    function History(canvas,dataList){
		this.data = dataList; // json data type { [ { year : {nuber} , children : [{ title : 'string' , contents : 'stirng'}, .... ,{}] }, ... ,{}]}
        this.canvas = canvas; // svg가 그려질 div
        this.height = 60; // 초기 기본 높이 
        this.direction=0; // text direction , 0: left , 1 : right
		this.rad = 60; // radius of year cicle
		this.strokeWith = 10; // circle stroke thickness
		this.textOffsetY = 70; // text contents 줄간격
		this.textOffsetX = 4/5; // 중심선 대비 들여쓰기 정도
        this.width = 1110; // svg 넓이
        this.scale = $(this.canvas).innerWidth()/this.width;
        this.init(); // 초기화함수 실행
        }
        return History;
    })(History || {});
    var his = History.prototype;

    /*
    * 프로토타입 초기화
    */
    his.init = function(){
        this.svg = d3.select(this.canvas)
        .append("svg")
        .attr('id', "history")
        .attr('width',this.width)
		.attr('height',this.height);
        this.topLevelG = this.svg.append('g')
            .attr('class', 'top-level-g');
        this.setYear(this.data);
        this.endLine();
		this.svg.attr('height',this.height);
        this.windowResize();
        this.zoomd();
    }

    /**
     * 연도 별 svg tag 그리기 설정
     * @param {json}} data 
     */
    his.setYear = function(data){
		$.each(data, (idx, element) => {
			var year = element.year;
			this.drawYear(year);
			this.setEvent(element.children);
		});
        
        this.direction = this.direction == 0 ? 1 : 0;
    }

    /**
     * 연도 circle 그리기
     * @param {number} year 
     */
    his.drawYear = function(year){

        var height = this.height + this.rad + this.strokeWith/2;
        var width = this.svg.attr('width');

		//circle 그룹 추가
		var g = this.topLevelG.append('g')
		.attr("transform", 'translate(' + width/2 + ',' + height + ')')
		.attr("x",width/2)
		.attr("y",height);

        //연도 원추가
        g.insert('circle')
        .attr('id', "circle"+year)
        .attr('class','year-circle')
        .attr('cx',0)
        .attr('cy',0)
        .attr('r',this.rad);
        // 연도텍스트 추가
        g.insert("text")
        .attr("class","year-text")
        .attr("x",-42.5)
        .attr("y",12)
        .text(year);

        this.height = height + this.rad + this.strokeWith/2;
    }


    his.setEvent = function(data){
        var g = this.topLevelG.append("g")
        .attr("class", "svg-text-group");
		$.each(data,(idx,element) => {
			var title = element.title;
			var contents = element.contents;
			this.drawEvent(g, title, contents);
		});
		this.direction = this.direction == 0 ? 1 : 0;
    }

    /**
     * 
     * @param {svg.g} g 
     * @param {String} title 
     * @param {String} contents 
     */
    his.drawEvent = function(group, title, contents){
		var preheight = this.height;
		var afterheight = this.height + this.textOffsetY;
		this.drawLine(preheight,afterheight);
		var className = this.direction == 0 ? 'contents-text-left' : 'contents-text-right';
		var g = group.append('g').attr("class", className+"-g");
        var textArr = contents.split('\n');
        var preY = 0;
        g.selectAll('text')
        .data(textArr)
        .enter()
        .insert('text')
		.attr('class', className)
		.attr('x', 0)
		.attr('y',function(d){
            var y= preY;
            preY += 25;
            return y;
        })
		.attr('title',title)
        .text(function(d){return d;});

		var parentWidth = this.svg.attr('width')/2;
		var offsetWidth = parentWidth * this.textOffsetX;
		var x = this.direction == 0 ? parentWidth - offsetWidth : parentWidth*2 - offsetWidth;
		var y = this.height;
		g.attr('x', x)
		.attr('y',y)
		.attr('transform', 'translate(' + x + ',' + y + ')');
		this.height = afterheight;
    }

    /**
     * 연표중심선 그리기
     * @param {number} preheight 
     * @param {number} afterheight 
     */    
    his.drawLine = function(preheight,afterheight){
		var x= this.svg.attr('width');
        this.topLevelG.append('line')
		.attr('class', 'history-line')
        .attr("x1",x/2)
        .attr("x2",x/2)
        .attr("y1",preheight)
        .attr("y2",afterheight);
    }

    /**
    *   연표의 마지막 부분  
     */
    his.endLine = function(){
        var x = this.svg.attr('width')/2;
        var preheight = this.height;
        var afterheight = preheight + 80;
        this.topLevelG.append('line')
            .attr('class','end-line')
            .attr('x1', x)
            .attr('y1', preheight)
            .attr('x2', x)
            .attr('y2', afterheight);
        this.height = afterheight;
    }


    /**
     * 화면 조정시 svg 크기 조절
     */
    his.windowResize = function(){
        var history = this;
        $(function(){
            $(window).resize(function(){
                history.scale = $(history.canvas).innerWidth()/history.svg.attr("width");
                history.zoomd(); //비율조정 호출
            });
        })
    }

    /**
     * 비율조정 
     */
    his.zoomd = function(){
        var scale = this.scale;
        var scaleStr;
        var svgWidth = this.svg.attr('width');
        if(scale < 0.5){
            scale *= 1.7;
            var x = (svgWidth/2 - svgWidth/2 * this.textOffsetX);
            this.svg.selectAll('.contents-text-right-g').attr('transform',function(d){
                return "translate("+x+","+$(this).attr("y")+")";
            });
        }else{
            var x = (svgWidth - svgWidth/2 * this.textOffsetX);
            this.svg.selectAll('.contents-text-right-g').attr('transform',function(d){
                return "translate("+x+","+$(this).attr("y")+")";
            });
        }
        scaleStr = "scale("+scale+")";
        var height =  this.height * scale;
        this.svg.attr("height", height);    
        this.topLevelG.transition().duration(100).attr('transform',scaleStr);

    }

