$(document).ready(function(){
	
    //Center Image thumbnails
	BI_thumbs.center_thumb_img();
    BI_thumbs.img_preload('.thumb > img'); 	
    
   
    $('#menu-photography a[href*=#]').each(function(){
          
          var selector = $(this).attr('href'),
              re = /#(.*)$/;
          
          selector = (selector.match(re));
          selector = selector[0];
          
          $(this).attr('href', selector); 
       });                           
                                  
    
    //Event that listens for Externnal changes in the url address bar
		$.address.change(function(e) {
		
        var selector, 
		    thumb_container = $('.thumb_container'),
            default_selector = $('#menu-photography a[href*=#]:first').attr('href'),
            re = /#(.*)$/;
            
         //Get default Colleciton   
        default_selector = (default_selector.match(re));
        default_selector = default_selector[1] ? default_selector[1] : false; 
        
        //If there is no hash
        if(e.path === '/'){
			
            selector = default_selector;
        
        }else{
			
            selector = e.pathNames[0];
            //Checking that hash has a match
            if( thumb_container.find('a[class*='+selector+']').length === 0 ){ 
              selector = default_selector;  
            } 
		}
        //Show and Hide Collections
        thumb_container.find('a').hide();
        thumb_container.find('a[class*='+selector+']').show();
            
        });
        
}); //End of Doc Ready  