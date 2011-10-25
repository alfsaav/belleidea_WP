$(document).ready(function() {

PORTF_PAGE.init({gall_holder:'#web_gallery',
				 gal_height:'350',
				 full_screen:false,
				 automatic:false,
				 gAnalytics:true,
  				 url_context:'web'});

/*Updating Pages meta_data*/
var gall_meta =  PORTF_PAGE.meta_data //Gallery meta data obj
	 
	 PORTF_PAGE.PIC_Changed = function(){
	 //Updating nav menu meta data
	 $('#current_pic_bi').text(gall_meta.index);
	 }

	 PORTF_PAGE.GALL_Loaded = function(){
	 $('#current_set_bi').text(gall_meta.title);
	  }

//Create and append link gallery URL hook on header

$('<a href="#" target="_blank">(go to url)</a>').appendTo('#thi_cat p');


//Porftolio Tiles hover functions

$("#web_port div").hover(
function(){ //hover on

//$(this).find('img').stop(true, true).fadeOut('fast');
$(this).find('img').hide();
								  
								  },
function(){ //hover out

//$(this).find('img').stop(true, true).fadeIn('fast');
$(this).find('img').show();
							  
								  });								  
/*When Picture div is pressed*/
 $("#web_port div").click(function(e){
	
  //Showing showcase back button
  $("#showcase_btn").show();
  
  //Saving text title to later retrieve it
  var curr_text =  $('#current_set_bi').text();
  $('#current_set_bi').data('curr_text',curr_text);
  
  //get gallery link and hooking it up with the div containing the images
  var gall_link = $(this).attr("title");
  
  //Showing and hiding pannels
   $('#web_port').slideToggle();
   PORTF_PAGE.gal_toggle(function(){
   //Loading Set of pics
   PORTF_PAGE.load_json(gall_link);
   });
   
  //url button
  var url_link = $(this).find('input').val();   //$(gall_link).find('h2').text();
  
  if(url_link!=null){
  $('#thi_cat a').attr('href',"http://"+url_link).show();
  $('#thi_cat a').text("("+url_link+")");
  }
  
  e.preventDefault();
  });

$("#showcase_btn").click(function(e){
  
  _gaq.push(['_trackPageview']); //Send track trail to GAnalytics
  go_back_web();
  $(this).hide();
  //hide url button
  $('#thi_cat a').hide();
  e.preventDefault();
  
  });


});//End of doc ready func


function go_back_web(){
	 //Retrieving Showcase title and setting it up
	 var curr_text = $('#current_set_bi').data('curr_text');
	 $('#current_set_bi').text(curr_text);
	 //Showing and hiding panels
	 PORTF_PAGE.gal_toggle(function(){
	 $('#web_port').slideToggle();								
	 }); 
	 
     
	}