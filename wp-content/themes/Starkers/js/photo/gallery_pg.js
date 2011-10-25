$(document).ready(function(){
		
		//Setting up image slider
		Pic_Slider.init({gall_holder:'#web_gallery',
				 gal_height:'500',
                 gal_width:'100%',
				 full_screen:false,
				 automatic:true,
                 timer_prd:5000
                 });
	
		//When pic_slider obj is finished loading, hide and remove hidden class
        Pic_Slider.GALL_Loaded = function(){
             var slider_holder = Pic_Slider.get_holder();
            slider_holder.hide()
                         .removeClass('hidden');
        
        }
        //Setting Function Callback when Picture changes
		Pic_Slider.PIC_Changed = function(){
			 var gall_meta =  Pic_Slider.meta_data //Gallery meta data obj
			 
			 //Updating nav menu meta data
			 $('#current_pic_bi').text(gall_meta.index);
			 
			 //$.address.queryString('pic='+ gall_meta.index);
		 }
		
        Pic_Slider.load_php_json(BI_GLOBAL.pics,1); //BI_GLOBAL coming from PHP_JS view
        //When site address bar is first intiatiated 
		/*
        $.address.init(function(e) {
		
			if(window.location.hash == '' || typeof e.parameters.pic == 'undefined' ){
		 	
			Pic_Slider.load_php_json(BI_GLOBAL.pics,1); //BI_GLOBAL coming from PHP_JS view	
		 
		 }else{ 

			if( typeof e.parameters.pic !== 'undefined')
			  {
				  var pic_index = e.parameters.pic
				  Pic_Slider.load_php_json(BI_GLOBAL.pics,pic_index); //BI_GLOBAL coming from PHP_JS view	
				 // Pic_Slider.go_to_pic(pic_index);
			  }
		 }
		
		}); //End of Int listener
		*/
		//Thumbnails Listeners - When thumb is clicked Slider will open on the selected pic
        $('#image_gallery .image_cont').click(function(e){
				var index = $(this).attr('href');
				index  = index.match(/(\d+)/)[1];
			    $('#gall_nav .slider').trigger('click');
                
                Pic_Slider.go_to_pic(index);
		      
              e.preventDefault();
		});
        
        //Navigation Listeners
        
        //Gallery Views
        $('#gall_nav .slider,#gall_nav .thumbs').click(function(e){
         e.preventDefault();
          if(!$(this).hasClass('active')){  //Check that is not active    
                
                if($(this).hasClass('slider')){
                    
                    BI_thumbs.switch_panel('#holder_wrap_bi');//Shows Container based on id
                    $('#gall_nav .play').trigger('click');
                    Pic_Slider.scroller_mf(Pic_Slider.current_pos, true); //switch to current pic;
                
                }else{
                    //Check that slider is not in full screen if it is, turn it off
                    if(Pic_Slider.fs_on){
                        $('#gall_nav .full_screen').trigger('click');     
                    }
                    BI_thumbs.switch_panel('#image_gallery','fade out');
                    
                    Pic_Slider.set_timer('off');
                    $('#gall_nav .play').removeClass('active');
                    
                }
                if($(this).attr('class') === 'slider'){
                  $('#page_hd .sl-mode').fadeIn('1000');  
                }else{
                  $('#page_hd .sl-mode').fadeOut('300');
                }
                
                $('#gall_nav .slider,#gall_nav .thumbs').toggleClass('active');
          
                $('body').toggleClass('no-fixed');
          
          }      
                
                
        });
        //Automatic Play Listeners
        $('#gall_nav .play').click(function(e){
          e.preventDefault();
          
                if($(this).hasClass('active')){
                  Pic_Slider.set_timer('off')  
                }else{
                  Pic_Slider.set_timer('on') 
                }
                $('#gall_nav .play').toggleClass('active');
         
        });
        
        //Full Screen Button
         $('#gall_nav .full_screen').click(function(e){
             Pic_Slider.full_screen();
             $(this).toggleClass('active');
        })
        
        //Back button to collections bar
        $('#gall_meta .back_btn').mouseover(
                                        function(e){
                                           
                                           $('.menu_hd_lv3').stop(true,false).animate({'margin-top':'0'});
                                
                                        });
        $('.menu_hd_lv3').mouseleave(
                                     function(){
                                            
                                           $(this).stop(true,true).animate({'margin-top':'-44px'});
        
                                    });
        
             
        //Init Thumbs >> Initializes thumb tooltips; 
	   	BI_thumbs.init();
      
        //Initial Defaults
        $('#gall_nav .thumbs').addClass('active');
        $('#gall_nav .pause').trigger('click');	
        
        //Only display link to collections except the one currently in
        var curr_title = $('#gall_meta .back_btn').text().trim();
        
        $.each($('.menu_hd_lv3 .collec_nav li a'),function(i,link){
            
            var text = $(link).text();
            
            if(text === curr_title){
                
                $(link).parent().hide();
                
            }
            
            
        });
        
        
        
       
        
		
}); //End of Doc Ready  