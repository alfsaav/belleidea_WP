
/*LIGHT BOX OBJECT*/
var BI_lightbox = {
	div_id:'bi_lightbox',//ID for lightbox div
	content_id:'content_lb',
	close_id:'close_lb',
	format: '',
	
/*INIT FUNC*/	
	init:function(){
	
	var _self = this;
	
	//Creating LightBox element and appending it to the dom
	$('<div></div>')
	.attr('id',this.div_id)
	.css({
		'background-color':'#fff',
		'display':'none',
		'height':'100%',
		'left':0,
		'position':'fixed',
		'opacity':0,
		'top':0,
		'width':'100%',
		'z-index':1000
		})
	.prependTo('body'); //LightBox div for fullscreen mode. 
	
	//Creating LightBox  container element and appending it to the light Box wrapper
	$('<div></div>')
	.attr('id',this.content_id)
	.css({
		'display':'none',
		'position':'absolute',
		'top':0,
		'left':0,
		'width':'200px',
		'overflow':'auto',
		'z-index':1100  //Greater than LightBox container
		})
	.appendTo('body'); //Appending to Body
	
	$('<a></a>')
	.attr('id',this.close_id)
	.css({
		'position':'absolute',
		'top':0,
		'display':'block',
		'right':0,
		'width':'50px',
		'height':'30px',
		'z-index':1150  //Greater than LightBox container
		})
	.appendTo('#'+this.content_id); //Appending to lightbox conteiner
	
	//Adding Resize Event Listener
	$(window).resize(function() {
	_self.center_elems();//Centering element
	});
	
	//Adding UI Click Events
	$('#'+this.div_id+','+'#'+this.close_id).click(function(e){
	  _self.close();
 	})
	
	}, //END of INIT FUNC
	
/*TOGGLE_LB FUNC*/ //Turn On || Off Light Box with HTML markup inside
	toggle:function(content, format){
		
		var _self = this;
		
		if(typeof format !== 'undefined' )
		_self.format = format;
		
		if (!$('#'+this.div_id).length>0)
		{
			 _self.init();
		}
		
	    var wrap = $('#'+this.div_id);
  		var cont = $('#'+this.content_id);
		
		if( wrap.css('display')!= "block")
		{
			
			_self.add_content(content);	//Adding Content to the div container
			
			cont.show();
			wrap//Doing stuff with the cont conteiner
			.show()
			.animate({opacity:0.8},'fast','linear',function(){
			$('html, body').animate({scrollTop:0}, 'slow');
			});
			
			
		}
		else{
			
			_self.close();
		}
     
	return this; 
	 
	}, //END of INIT FUNC
	
/*ADD_CONTENT FUNC*/ //Turn On || Off Light Box with HTML markup inside
	add_content:function(content){
		
		var _self = this;
		
		var c_width = parseInt( $(content).css('width'));
		var c_height = parseInt( $(content).css('height'));
		
		
		
		$("#"+_self.content_id).css({
	
		  'width':c_width,
		  'height':c_height
		  
		});
		
		if( $(content).length > 0  ) //If full_screen is not on 
		{  
			$(content)
			.clone()
			.css('display','block')
			.appendTo("#"+_self.content_id);
			_self.center_elems();//Centering element
			
			return true;
			
		}else{
			return false;	
		}
		
	},
/*Center Elems FUNC*/ //Turn On || Off Light Box with HTML markup inside	
	center_elems:function(){
		var _self = this;
		var w_width  = $(window).width();
		var w_height = $(window).height();
		var cont = $('#'+this.content_id)
		var format = _self.format;
		
		//Center gallery nav buttons
				
		switch (format)
		{
		
		case "hor":
			var h_cont_center = Math.round((w_width - parseInt( cont.css('width') ) )/2);
			
			cont.css({'left':h_cont_center+'px'})
			cont.css({'top' :'150px'})
			break;
		
		case "ver":
			var v_cont_center = Math.round((w_height - parseInt( cont.css('height') ) )/2);
			
			cont.css({'top' :v_cont_center+'px'})
			cont.css({'left': 0})
			break;
			
		default:
			var h_cont_center = Math.round((w_width - parseInt( cont.css('width') ) )/2);
			var v_cont_center = Math.round((w_height - parseInt( cont.css('height') ) )/2);
			cont.css({'left':h_cont_center+'px'})
			cont.css({'top' :v_cont_center+'px'})
			break;
		}
		
		console.log("block: "+this.content_id+" block height "+parseInt( cont.css('height'))+" v_cont_center "+v_cont_center);
		
    },
	
	close:function(){
	 
	 var _self = this;
	 var wrap = $('#'+this.div_id);
	 var cont = $('#'+this.content_id);
	
			wrap
			.hide()
			.css('opacity',0);
			
			cont
			.hide();
			//Delete all elements except for the close box
			cont.children().not('#close_lb').remove();
			
		
	}
	
	
}//END of CDN_LB obj

