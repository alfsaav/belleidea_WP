var BI_thumbs = {       
	/*
	Thumbnails handler
	*/
    init:function(id){
		
		var that = this;
		
	
        that.img_preload('.thumb .image_cont > img');
        
        
		//Thumbnails Hover Handler
		$('.thumb').hover(function() {
			
            if($(this).find('.image_cont .pre_img').length > 0)
            return false;
            
            var thumb = $(this).find('.thumb_tip'), //Thumbnail container
			thumb_pic = $(this).find('.thumb_tip img'), //Thumbnail pic
			pic = $(this).find('.image_cont > img'), //Original pic 
			pos_x = 0,
			pos_y = 0,    
			init_pos = pic.position(); //current size position obj
			
            //Getting initial and final widths 
			var w_ini = pic.width(),
			w_fin = thumb_pic.attr('width')
			
			var h_ini = pic.height(),
			h_fin = thumb_pic.attr('height')
			
			//Padding offset
			var padd_y = parseFloat(thumb.css('padding-top'))/2; 
			var padd_x = parseFloat(thumb.css('padding-left'))/2; 
			
			//Final thumb position
		
            pos_x = init_pos.left - (w_fin - w_ini)/2 - padd_x; 
			pos_y = init_pos.top - (h_fin - h_ini)/2 - padd_y; 
            
			
            //Updating position 
			thumb
			.css({'z-index' : '10',
                'position':'absolute',
                'width':w_fin,
                'left': pos_x, 
                'top': pos_y
            }) 
			.stop(true,true);
            
            if( $('body').hasClass('firefox') || $('body').hasClass('IE7')){ //Check for Firefox
                
              thumb.show();
                
            }else{
            
              thumb.effect("size", 
                        {
                             origin:['middle','center'],
                             from:{'width': w_ini,'height': h_ini}, 
                             to: {'width': w_fin,'height': h_fin},
                             scale:'content' 
                        }, 200);      
		    }      
            
			
		}, function() {
			
            var thumb = $(this).find('.thumb_tip');
            
            thumb
    			//.removeAttr("style")
                .stop(true,true)
                .hide();
            
            thumb
                 .find('img')
                 //.removeAttr("style")
                 .stop(true,true);
         	
		});
	},//End of init func 
	
////
//Show Thumnails (based on container id)
////
	switch_panel:function(id,anim_type,callback){
		
		var _self = this;
        
        //sanitazing entry var
		if(id.search(/#/) == -1){
			id = '#'+id;            
		}
        ////
        //Hide Active Panel
	    var old_panel = $('.photo_elem.active');
            
        switch(anim_type){
            
            case "fade out":
                _self.fade_up(old_panel);
                break;
            default:
                old_panel.hide();
        }
          
        old_panel.removeClass('active');
        
        //Add Selected Panel
        $(id).show()
             .addClass('active');
		
        //Run Callback if any
        $.isFunction(callback) && callback();
        
		
	},//End of show_thumbs func 	 	

////		
//Centering Thumbnail images with its frame	
////
	center_thumb_img:function(){
    
    var my_thumbs = $('.thumb');
    
    $.each(my_thumbs, function(i,thumb){
        
        var my_img = $(thumb).find('img'),//image to be displaced
        	img_w = my_img.width(),
            img_h = my_img.height(),
			f_img_w,
            f_img_h,			
            thumb_d = my_img.parent().width(); //Size of container 									
        
        //Center Thumbnails with respect to its frame			
         
         f_img_w = Math.round((thumb_d - img_w)/2); //Horizontal			
         f_img_h = Math.round((thumb_d - img_h)/2); //Vertical			
         my_img.css({
                    'left':f_img_w+'px',				
                    'top':f_img_h+'px',			
                    'opacity':0.75
                    })		
         //Hover Effect
         my_img.parent().hover( 
                        function(){
                            
                            var scale = 1.1,
                                img = $(this).find('img'),
                                ini_w = img.width(),
                                ini_h = img.height(),
                                fin_w = img.width()*scale,
                                fin_h = img.height()*scale;
                            
                            var ini_pos_x = parseInt(img.css('left')),
                                ini_pos_y = parseInt(img.css('top')),
                                fin_pos_x,
                                fin_pos_y,
                                delta_x,
                                delta_y
                                
                                delta_x = (fin_w - ini_w) /2;
                                delta_y = (fin_h - ini_h) /2;
                                
                                fin_pos_x  = ini_pos_x - delta_x;
                                fin_pos_y  = ini_pos_y - delta_y;
                                
                                //Storing data
                                if(typeof $.data(this,"dims") === 'undefined'){
                                   
                                    $.data(this, "dims", { width: ini_w,
                                                           height: ini_h,
                                                           top: ini_pos_y,
                                                           left: ini_pos_x 
                                                          });
                                                          
                                 }                     
                                //Fail gracefully 
                                //if( $('body').hasClass('firefox') || $('body').hasClass('IE7') || $('body').hasClass('IE8') ){ //Check for Firefox
                                if(  $('body').hasClass('IE7') || $('body').hasClass('IE8') ){ //Check for Firefox                
                                  img.css({
                                             top:fin_pos_y,
                                             left:fin_pos_x,
                                             width:fin_w ,
                                             height:fin_h, 
                                             opacity:1
                                          })
                                    
                                    return false; // or die
                                }
                                
                                
                                //Animate
                                img.stop(true,true)
                                       .animate({top:fin_pos_y,
                                                 left:fin_pos_x,
                                                 width:fin_w ,
                                                 height:fin_h, 
                                                 opacity:1
                                                 }, 100);
                           
                        },
                        function(){
                            
                            var old_dims = $.data(this,"dims"),
                                img = $(this).find('img');
                            
                            //Fail gracefully 
                            //if( $('body').hasClass('firefox') || $('body').hasClass('IE7') || $('body').hasClass('IE8') ){ //Check for Firefox
                            if( $('body').hasClass('IE7') || $('body').hasClass('IE8') ){ //Check for Firefox
                              img.css({
                                        width: old_dims.width,
                                        height: old_dims.height,
                                        top: old_dims.top,
                                        left: old_dims.left,
                                        opacity:0.75
                                      })
                                
                                return false; // or die
                            }
                            
                            
                            
                            //animate back to normal   
                            img.stop(true,true)
                                   .animate({ width: old_dims.width,
                                          height: old_dims.height,
                                          top: old_dims.top,
                                          left: old_dims.left,
                                          opacity:0.75
                                        },400);   
                        
                        })
         
         
         });//End of each			
    },
////
//Thumb/IMG Preloaders 
////
    img_preload:function(selection, class_name){
        
        var imgs = $(selection);
        
        if(imgs.length === 0 ){
            
            return false;  //If selection doesn't exist, kill func
            
        }
        
        $.each(imgs,function(i, img){
            
            var width = $(img).width(),
                height= $(img).height(),
                img_par = $(img).parent(); //img parent
            
            if ($.browser.msie){ //if MSIE add queries to fool IE and have it reload the img everytime, therefore no cashing for IE!! 

				var pic_url = $(img).attr('src');
                
                $(img).attr('src', pic_url + '?random=' + (new Date()).getTime());	

			}
            
            
            $(img).load(function(){
                $(this).parent().find('.pre_img').remove();
                $(this).parent().find('img').show();
            })             
                
            //Preload Image
            var pre_img = $('<div></div>');
			
			pre_img.css({
			             'width':width,
                         'height':height,
                         'top': $(img).css('top'),
                         'left': $(img).css('left')
			            })
                          .addClass('pre_img')
                          .appendTo(img_par);    
         });

    },
////		
//Transition animations
////
    
    fade_up:function(obj, callback){
        
        var obj_pos = $(obj).position();
        
        $(obj).css({ 'position':'absolute', 
                     'top':obj_pos.top,
                     'left':obj_pos.left,
                     'z-index':10000
                    }).animate({'opacity':0,
                                'top':-150},750,function(){                    
    
                                        $(this).removeAttr("style")
                                               .hide();
                                 });

        
        
    }


    
}//End of BI_thumbs 
