var gallery_mng = {
   gall_obj:function (params){ //contains all information regarding the gallery
		this.index = params.index;
		this.type = params.id;
		this.slug_url = params.width;
		this.link = params.height;
		this.num_pics = params.url;
	 },
   my_galls:[], //array that contains all gall_objs 
   callback:"",
   flickr_load: function (func) {
        var _self = this;
		var api_method = 'flickr.collections.getTree';
		var api_call = 'http://api.flickr.com/services/rest/?method=' + api_method + '&api_key=' + PORTF_FLICK.api_key + '&user_id='+PORTF_FLICK.user_id+'&format=json&jsoncallback=?';
		this.callback = func;
		
		$.ajax({
            type: "GET",
            url: api_call,
            dataType: "json",
            success: function (data) {
		
       	    _self.display(data.collections.collection);
            
			
			},
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("We are sorry, there has been an error in the database, we are looking into it.");
            }
        });
    },
	
	//DISPLAY
	display: function (colls) { //create tables and links
		
			//Create light_screen box
			$('<div></div>').attr('id','body_wrapper').prependTo('body'); //LightBox div for Table menu mode. 
			
			$.each(colls, function(i,obj){
         	obj.set.reverse();
			var counter = 0;		
			var n_rows = Math.ceil(obj.set.length/4);
			var table = $('<table></table>');
			for (var n = 0; n <n_rows; n++) {
				
			var t_row = $("<tr>");
				for (var c =0; c <4; c++) {
					
					if(counter==obj.set.length){
					break;	
					}
					
					var t_cell = $("<td>");
					var link_id = obj.set[counter].id;
					var link_text = obj.set[counter].title;
					
					//get number of pictures per set
			       
					
				    var cell_link = $('<a></a>')
					.attr('href',"#"+bi_slug(link_text))
					.attr('rel',link_id)
					.attr('name',link_text)
					.html(link_text+" (<span>"+0+"</span>)");
					
					t_cell.html(cell_link).appendTo(t_row);

                counter+=1;
				}
			    t_row.appendTo(table);	
			}
	    table.attr('id',obj.id).appendTo('#table_menu');
		
		});//End of each func
          
//--adding number of pics per set
       //get array of all link inside all tables  
	  var links_arr  = $('#port_hd table a');
	   //Flickr API method
	  var _get_set_info = 'flickr.photosets.getInfo';
	   //Cycle though all links and get the number of photos
	   $.each(links_arr, function(i,val){
		   var link_id = $(val).attr('rel'); 
		   $.ajax({
				type: "GET",
				
				url: 'http://api.flickr.com/services/rest/?method='+_get_set_info+'&photoset_id='+link_id+'&api_key='+PORTF_FLICK.api_key +'&user_id='+PORTF_FLICK.user_id+'&format=json&jsoncallback=?',
				
				dataType: "json",
				
				success: function (my_data) {
					var num_pics = my_data.photoset.photos;
					$(val).find('span').text(num_pics);
					}//End of success callback
				
				});//End of ajax func

       });//End of links_arr loop

	//Callback function
    $.isFunction(this.callback) && this.callback();
	

}//End of display func 

}//end of gallery_mng OBJ

function load_url_gall(e){ //Getting value from # url address
	 
	  var url = e.path;
	  var pic = parseInt(e.parameters.pic);
	  if (isNaN(pic)) //If pic index is not given, or is not a number, make index = 0
	  pic = 0;
	  if(url!="/")
	  {
			   var query = url.replace(/^\//,'#');
			   query = query.replace(/\/$/,'');
               var gall_req = $('a[href='+query+']').attr('rel');
			   PORTF_PAGE.load_flicker(gall_req,pic)
			   
		}else{ //Defaults to 
		   
			   PORTF_PAGE.load_json("photo_gal");	  
	  }
      
	 
}//End of load_url_gall func

function query_img(index){
	
	if(index==''|| !isNaN(index))
	 {
	 var query_s = 'pic='+index;
	 if (index == '')
	 query_s = index;
	 
	 $.address.history(false);
	 $.address.queryString(query_s);
      $.address.history(true); 
	 }
}

/*When document is loaded*/
$(document).ready(function () {
     
	 var gall_meta =  PORTF_PAGE.meta_data //Gallery meta data obj
	 PORTF_PAGE.PIC_Changed = function(){
	 	 
	 //Updating nav menu meta data
	 $('#current_pic_bi').text(gall_meta.index);
	 if($.address.path()!='/')
	 query_img(gall_meta.index);
	 }
	 PORTF_PAGE.GALL_Loaded = function(){
	 $.address.title(gall_meta.title);
	 $('#current_set_bi').text(gall_meta.title);
	 $('#total_pics_bi').text(gall_meta.t_pics);
	 }
	 
	 PORTF_PAGE.init({photoset:'72157624924250191',
					  gall_holder:'#osito',
					  gAnalytics:true,
					  url_context:'photo'});						 

//Initializes Address plugin for Photo Portfolio links
			 $("#port_hd table a, .flick_set_link").address(function(){
				  
				  query_img('');
				  var gall_req = $(this).attr('rel');
				  PORTF_PAGE.load_flicker(gall_req)
				  return $(this).attr('href').replace(/^#/,'');
			 });

    //Event that listens for changes in the url address bar
	$.address.externalChange(function(event) {
		    if($('#table_menu table').exists()){
	        load_url_gall(event); 
			}else{
			gallery_mng.flickr_load(function(){
			load_url_gall(event); 	
		    });	
		    }
	});								 
    
//------Setting Event Handlers-------//

//--Portfolio Table Navigation links--//
$("#port_hd ul li").each(function (i) {
        var _myTab = $(this).find('a');
        $(this).click(
        function (e) {
            $("#port_hd ul li").find('a').removeClass("tab_is_on");
            $("#port_hd table").hide(); // hide rest of the tabs
            
            var tab_add = $(_myTab).attr('href'); // get the id hook to call panel
            if ($(tab_add).is('table')) {
               // var table_h = 2+$(tab_add).height()+ (2*parseInt($(tab_add).css('padding-top'))); //table height added 2px more just in case
				$(tab_add).show(); // show tab panel
                toggle_port_table(true,_myTab); //open or close/which tab 
            }
            e.preventDefault();
        });
    });
//--Links inside tables, links to sets coming from Flickr--//
    $("#port_hd table a, .flick_set_link").live('click',function(e) {
	   var port_link = $(this).attr("href");
       lightbox_screen_off();
 	   $('#port_hd  ul li a').removeClass('port_its_on'); 
	   	   
	   //Check if link is in a table
	   if($(this).parents('table').exists())
	   {
	   var link_id = $(this).parents('table').attr('id');   
	   $('a:[href*='+link_id+']').addClass('port_its_on'); 
	   }else{
	   $(this).addClass('port_its_on');   
	   }

	});
	
});
//End of Page load

//---------Methods and Functions---------//
function lightbox_screen(){
		var wrap = $('#body_wrapper');
        
		 if(wrap.css('display')== 'none'){ //Only if it is hidden animate
		//Make sure there is no scrolling bar
		//$('body').css({'overflow':'hidden'});
		//Meaure window height
	    //var div_h = $(document).height();
		//prepare initial attributes
		wrap.css('opacity',0);
		//Animate wrap_box
		wrap.show().stop(true,true).animate({'opacity':0.3});
		//Adding click listener to screen		
        wrap.click(function(e){
		lightbox_screen_off();
 	    });
		
    	}//End if

}
function lightbox_screen_off(){
		 toggle_port_table(false);
		//Animate and Hide screen
		$('#body_wrapper').
		stop().
		fadeOut(
		   	       function(){
		 			
					//$('body').css({'overflow':'auto'});	
					
					});

}
function toggle_port_table(bool,_myTab) {
	
	if(bool){
		  //open tab
		  lightbox_screen();
		  $("#table_menu").css('z-index','20');
		  $("#sec_cat").css('z-index','20');
		  $("#table_menu").show();
		  $(_myTab).addClass("tab_is_on");
		  
		  }else{
		  //close tabs
		  // $("#port_hd").stop().animate({'height': '32px'}, 'fast', 'linear')
 		  $("#table_menu").hide();
		  $("#port_hd ul li").find('a').removeClass("tab_is_on"); //remove tab class
		  $("#sec_cat").css('z-index',0); //remove tab class
		  }
} 

