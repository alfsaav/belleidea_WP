$(document).ready(function() {

PORTF_PAGE.init({gall_holder:'#web_gallery',
				 gal_height:'400',
				 full_screen:true,
				 automatic:true});

/*Updating Pages meta_data*/
var gall_meta =  PORTF_PAGE.meta_data //Gallery meta data obj
	 
	 PORTF_PAGE.PIC_Changed = function(){
	 //Updating nav menu meta data
	 $('#current_pic_bi').text(gall_meta.index);
	 }
	 
	 PORTF_PAGE.GALL_Loaded = function(){
	 $('#current_set_bi').text(gall_meta.title);//*******ERASE LATER**********/
	 $('#total_pics_bi').text(gall_meta.t_pics);//*******ERASE LATER**********/
	 }

PORTF_PAGE.load_flicker('72157625962208508');
});