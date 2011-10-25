/*----ToDO----
If there is less than 2 pics? what happens?
*/

/*This object contains sensitive information, needs to be used with a proxy server app for security reasons*/

var PORTF_FLICK = { 
	api_key: '59f274e3514f672180c069409c7b745f',
    secret: '27e29ce1c6485b75',
    user_id: '47320488@N04'
};

//--------This Object fetches the images from Flickr using JSon---------///

var Pic_Slider = {

    defaults: {

		gall_holder: '#holder_wrap',

		container: '#img_holder',

		gAnalytics: false, //Google analytics tracking gallerie calls

		url_context: '', //url context page that will be based of the tracking url page

		photoset: '',

		selector: '',

		gal_width:'980',

		gal_height:'430',

		timer_prd:6000,//Timer frequency

		automatic:true,

		full_screen:true,

		nav_btns:true,

		opacity:0.3

	},

	//Private data

	container:'#img_holder',

	gall_pos: [],

	my_pics: [],

	//Timer vars	

	timer_id:0, //global variable that has the timer for the auto scroll function

	tm_gallery:0,//timer var that holds the gallery timer id

	default_pic:0,

	current_pos:0,

	gall_ctrl:'#page_hd', //div that contains the meta_info and nav for the gallery
    
    fs_offset: 47, //offset of FullScreen, usually for fullscreen hud
	//--Exportable Data--//

	meta_data:{ //META DATA used for easy exportable access

		title:"a title",

		t_pics:0,

		index:0

	},

	//Callbacks

	PIC_Changed:'', //callback func that gets set after a picture is changed

	GALL_Loaded:'', //callback func that gets set after after the gallery skeleton and meta_info has been loaded

	PICS_Loaded:'', //callback func that gets set after all the pics have been loaded

	//Ajax-Counters, they are listeners that check for different ajax calls success events

	ajax_list:{

		meta_data:false,

		all_pics:0

	},
    
    fs_on: false, //Check if full screen is on
    is_hidden: true, //Check if gallery is hidden
	//MyPic object prototype

myPic:function (params){

		this.index = params.index;

		this.id = params.id;

		this.width = params.width;
        
		this.height = params.height;

		this.url = params.url;
        
        this.url_s = params.url_s;
        
        this.url_m = params.url_m;
        
		this.x_pos = params.x_pos;

	},

	/*PIC_GETTER Func*/ //If query matches pic id, the pic obj will be returned

pic_getter: function(query){ 

		var _self = this;

		var pic_array =  _self.my_pics;

		var return_val;

		

		$.each(pic_array, function(i, value){

			

			var compare = value.id;

			if(query == compare){

				return_val =  value;

				return false;

			}					   

		});

		return return_val;

	},

	/*SET_METAINFO Func*/ //Setting gallery title and total num of pics

set_metainfo: function(info){

		var _self = this;

		var _defaults = _self.defaults;

		

		//Setting Set title and total num of pics

		_self.meta_data.title = info.gall_title;

		_self.meta_data.t_pics = info.total_pics;

		

		if(info.url_title.toLowerCase() == 'showcase' || info.url_title.toLowerCase() == 'unknown collection')

		{info.url_title = null}

		

		//Announce that meta_data is Loaded

		_self.ajax_list.meta_data = true;

		

		//Tracking Galleries Requets through AJAX or other entries using Google analytics JS API

		if(info.url_title != null && _defaults.gAnalytics == true){ //checking that there is a url_title and that google is allowed to track

			info.url_title = bi_slug(info.url_title);

			var track_url = '/'+_defaults.url_context +'/'+ info.url_title;

			//Google Analytics call

			_gaq.push(['_trackPageview',track_url]);

		}

		

		

	},

	/*INIT Func*/ //Initially to setup the obj

init: function(options){

		var _self = this; 

		//Adding user parameters 

		$.extend(_self.defaults,options);

		//Defaulting all vals to ints

        if(typeof(_self.defaults.gal_width) === 'string'){
	   	   if (_self.defaults.gal_width.search(/\%/) === -1 ){ //Checking for relative vals
            _self.defaults.gal_width = parseInt(_self.defaults.gal_width);
            }
        }else{
            _self.defaults.gal_width = parseInt(_self.defaults.gal_width);
        }
    	if(typeof(_self.defaults.gal_height) === 'string'){
            if (_self.defaults.gal_height.search(/\%/) === -1){ //Checking for relative vals
            _self.defaults.gal_height = parseInt(_self.defaults.gal_height);
            }
        }else{
            _self.defaults.gal_height = parseInt(_self.defaults.gal_height);
        }
        
		_self.defaults.timer_prd = parseInt(_self.defaults.timer_prd);
        _self.defaults.opacity = parseFloat(_self.defaults.opacity);

		

		$(_self.defaults.gall_holder).attr("id","holder_wrap_bi"); //changing id to match css style

		_self.defaults.gall_holder = "#holder_wrap_bi"; //changing default id of gallery holder

		

		var gall_wrap = $(_self.defaults.gall_holder);

		

		//Creating html elements inside image container

		$('<div></div>').attr('id','bi_light_box').prependTo('body'); //LightBox div for fullscreen mode. 

		$('<div></div>').addClass("gall_btn gall_btn_prev").appendTo(gall_wrap);

		$('<div></div>').attr("id", "img_holder").appendTo(gall_wrap);

		$('<div></div>').addClass("gall_btn gall_btn_next").appendTo(_self.defaults.gall_holder);

		

		//--Gallery Navigation Button Handlers--//    

		//NAVIGATION BUTTONS



		if(_self.defaults.nav_btns){

			$('.gall_btn').show();

			//Hover handlers

			$('.gall_btn').hover(

			function() {//Over

				$(this).addClass('port_btn_hover');

			},

			function(){//Out

				$(this).removeClass('port_btn_hover');

			}

			);

			//Next and Prev buttons handlers

			$('.gall_btn_next').click(function (e) {

				_self.scroller_mf(_self.current_pos+1);

				e.preventDefault();

			});

            

			$('.gall_btn_prev').click(function (e) {

				_self.scroller_mf(_self.current_pos-1);

				e.preventDefault();

			});
       
		}

		

		//FULL SCREEN BUTTON

		$('<div></div>').addClass("full_scr_btn").appendTo(gall_wrap);



		if(_self.defaults.full_screen){ // Depends on default settings

			//Setting Handlers and settings for Full Screen button

			$("<span>Enter full screen</span><span style='display:none'>Exit full screen</span>").appendTo('.full_scr_btn');

			//Hover Events

			$('.full_scr_btn').hover(

			function() {//Over

				$(this).addClass('full_scr_hover');

			},

			function(){//Out

				$(this).removeClass('full_scr_hover');

			}



			);

			

			//Click event

			$('.full_scr_btn').click(function(e){

				$(this).removeClass('full_scr_hover');

				_self.full_screen(500);

				$(this).find('span').toggle();	  

				e.preventDefault();							  

			});

			//Hide n show when cursor is on gallery

			$(_self.container).add('.full_scr_btn').hover( // hover over gallery stop timer, 

			function(){ //OVER

				$('.full_scr_btn').show();

			},

			function(){  //OUT

				$('.full_scr_btn').hide();

			})

			

		}
       //Listener when window is resized: 
       $(window).resize(function() {
				
                _self.scroller_mf(_self.current_pos, true);

			}); 
		

		

	},//End of Init Func

	/*LOAD_JSON Func*/ //Load images that reside in a JSON File

load_json:function(selector, pic_index){ //images = a $(selector);

		

		var _self = this; 

		var _container = $(_self.container);

		var api_call = '/galleries/'+ selector +'.json';

		//Deactiveate timer

		_self.timer(false);

		//Check for intial picture index	

		if (!isNaN(parseInt(pic_index)))

		_self.default_pic = parseInt(pic_index);		

		

		$.ajax({type: "GET",

				url: api_call,

				dataType: "json",

				success: function (data) {

					

				var images = data.img;

				var set_title = "Unknown collection"

				

				if(data.title!=null){

					set_title = data.title;

					var n_pics = images.length;

				}

				//Setting gallery meta_info

				_self.set_metainfo({

					gall_title:set_title,

					total_pics:n_pics,

					url_title:set_title

				});

				_self.my_pics = new Array; //Flushing previous my_pics array

				

				if(images.length > 0){

					

					$.each(images, function (i, photo) {

						

						//var pic_width = parseInt($(photo).css('width'));

						//var pic_height = parseInt($(photo).css('height'));

						var pic_width = photo.width;

						var pic_height = photo.height;

						var pic_url = photo.src;

						var pic_index = i;

						

						//creating a new myPic object id/index/position

						var pic_obj = new _self.myPic({width:pic_width, height:pic_height, url:pic_url, index:pic_index}); 

						_self.my_pics.push(pic_obj); //pushing myPic object to an array

					});

					//End of each function

					

					//Requesting layout creation with images collected		

					_self.display();

					

					

				}//End of images.exist func

				

			},//End of sucess call

error: function (XMLHttpRequest, textStatus, errorThrown) {

				alert("errorThrown: "+errorThrown+" textStatus: "+textStatus);//End of Ajax Call

			}

			

		});

		

		return('awesome');

		

	},//End of Load_JSON

	

//Load Json Part 2

load_php_json:function(data, pic_index){ //pic_index is the pic that will be first to show, data is the Json object with pics

		

		var _self = this; 

		var _container = $(_self.container);

		

		//Deactiveate timer

		_self.timer(false);

		//Check for intial picture index	

		if (!isNaN(parseInt(pic_index)))

		_self.default_pic = parseInt(pic_index);		

		

		//Passing img data to images array

		var images = data;

		var set_title = "Unknown collection"

		

		if(data.title!=null){

			set_title = data.title;

			var n_pics = images.length;

		}

		//Setting gallery meta_info

		_self.set_metainfo({

			gall_title:set_title,

			total_pics:n_pics,

			url_title:set_title

		});

		_self.my_pics = new Array; //Flushing previous my_pics array

		

		if(images.length > 0){

			

			$.each(images, function (i, photo) {

				

				var pic_width = photo.width_m;

				var pic_height = photo.height_m;

				var pic_url = photo.url_l;
                
                var pic_url_m = photo.url_m;
                
                var pic_url_s = photo.url_s;

				var pic_index = i;

				

				//creating a new myPic object id/index/position

				var pic_obj = new _self.myPic({ width:pic_width,
                                                height:pic_height,
                                                url:pic_url,
                                                url_m:pic_url_m,
                                                url_s:pic_url_s,
                                                index:pic_index
                                              }); 

				_self.my_pics.push(pic_obj); //pushing myPic object to an array

			});

			//End of each function

			

			//Requesting layout creation with images collected		

			_self.display();

			

		}//End of images.exist func



		

	},//End of Load_JSON	

	

	/*LOAD_FLICKER Func*/ //Requests pictures from a specific flickr photoset

load_flicker: function (set_id,pic_index) {

		var _self = this;

		var _container = $(_self.container);

		//Deactiveate timer

		_self.timer(false);

		//Cleaning Gallery MetaInfo vars

		_self.cleaning_gall();

		//Check for intial picture index	

		if (!isNaN(parseInt(pic_index))) //Check that it's a number

		_self.default_pic = parseInt(pic_index);		

		

		var fli_method = 'flickr.photosets.getPhotos'; 

		var api_call = 'http://api.flickr.com/services/rest/?method=' + fli_method + '&api_key=' + PORTF_FLICK.api_key + '&photoset_id=' + set_id + '&extras=url_o,url_m&format=json&jsoncallback=?';

		

		$.ajax({

			type: "GET",

			url: api_call,

			dataType: "json",

			success: function (data) {

				_self.my_pics = new Array; //Flushing previous my_pics array

		

				//Data Extracted from JSON file

				var images = data.photoset.photo;

				

				$.each(images, function (i, photo) {

					

					//Flickr Specific

					var farm_id = photo.farm;

					var photo_server = photo.server;

					var photo_id = photo.id;

					var photo_secret = photo.secret;



					var pic_width = "";

					var pic_height = "";

					var pic_url = "";

					var pic_index = i;

					

					if (photo.height_m < 500) { //account for small horizontal style pictures

						var pic_ratio = photo.width_m / photo.height_m;

						pic_width = Math.round(500 * pic_ratio) + ''; //converting to string

						pic_height = "500";

						//Building the url so it requests large (b) size pictures

						pic_url = "http://farm"+farm_id+".static.flickr.com/"+photo_server+"/"+photo_id+"_"+photo_secret+"_"+"b.jpg";

					} else {

						pic_width = photo.width_m;

						pic_url = photo.url_m;

						pic_height = photo.height_m;

					}

					

					var pic_obj = new _self.myPic({width:pic_width, height:pic_height, url:pic_url, index:pic_index}); //creating a new myPic object id/index/position

					_self.my_pics.push(pic_obj); //pushing myPic object to an array



				}); //End of each function

				/*Requesting Gallery meta_info and posting it*/

				var _get_set_info = 'flickr.photosets.getInfo';



				$.getJSON('http://api.flickr.com/services/rest/?method='+_get_set_info+'&photoset_id='+data.photoset.id+'&api_key='+PORTF_FLICK.api_key +'&user_id='+PORTF_FLICK.user_id+'&format=json&jsoncallback=?',

				function(data) {

					var info = {

						gall_title:data.photoset.title._content,

						total_pics:data.photoset.photos,

						url_title:data.photoset.title._content

					}

					//Load meta_info with data

					_self.set_metainfo(info);

				});//End of getJSON

				//Requesting layout creation with images collected		

				_self.display();

			},

			//End of SUCCESS

error: function (XMLHttpRequest, textStatus, errorThrown) {

				alert("We are sorry, there has been an error in the database, we are looking into it.");

			}

		});

	},//End of load_flickr func

	/*DISPLAY Func*/ //Creates the layout using the pictures that comes from any of the loaders*/

display: function () {

		var _self = this;

		var _container = $(_self.container);

		var _gal_width = _self.defaults.gal_width;

		var _gal_height = _self.defaults.gal_height; //Default height of all the pics

		var images = _self.my_pics; //images array 

		var totWidth = 0;

		var _opacity = _self.defaults.opacity;

		_self.current_pos = 0;

		/*Gallery Cleaning*/

		//Erase all divs inside holder

		_container.empty();

		/* Gallery Setup*/

		//Setting Up holder init dimensions

		var gall_wrap = $(_self.defaults.gall_holder);

		gall_wrap.css({

			'width': _gal_width,

			'height':_gal_height

		})

		//Centering Gall Nav Elements

		_self.center_elems(); 

		//Clone amount of pictures, to prevent clipping

		$.each(images, function (i, photo) {

			var temp = $.extend(true,{},photo); // Creating a clone of first obj 

			images.push(temp);

		});

		//setting updated my_pics array

		_self.my_pics = images; 

		//Image loaded handler

		img_loaded = function(){

		    
            var this_pic = $(this); 
            var current_index = "bi_photo_"+(_self.meta_data.index - 1);
            
            if($(this).parent().attr('id') === current_index){
                
                $(this).css('opacity',1);
                       
            }
              
              $(this).fadeIn('slow');  
              
            
            var my_opacity = _self.defaults.opacity;
            //When loaded fadein actual pic and remove old pic after loaded
            
            
            
            this_pic.parent().removeClass('_img_loading') //remove loading gif background from parent div
                            .addClass('loaded')
                            .find('.pre_img').remove();
            
			var	imag_l = $(this).parent().siblings().length;		

			/* Check if the first pic has been loaded
            if($(this).parent().attr('id') == "bi_photo_0"){
        		//scroll to initial position
        		_self.go_to_pic(_self.default_pic);  
            }
            */		

			if(_self.ajax_list.all_pics==imag_l)
			_self.check_all_pics();
            
			_self.ajax_list.all_pics++;

		}

		//Loop through all the images

		$.each(images, function (i, photo) {

			var pic_width = "";

			var pic_height = "";

			var pic_url = photo.url;
            
            var pic_url_s = photo.url_s;

			var pic_id = "bi_photo_"+i; //Hard coded filae suffix convention 

			

			photo.id = pic_id;

			//Make sure pictures are height priority, if a picture's height is off, scale to fit height

			if (parseInt(photo.height)< _gal_height || parseInt(photo.height)>_gal_height ) { //account for small horizontal style pictures

				var pic_ratio = photo.width / photo.height;

				pic_width = Math.round(_gal_height * pic_ratio) + ''; //converting to string

				pic_height = _gal_height;

			}else {

				pic_width = photo.width;

				pic_height = photo.height;

			}

			//Creating DOM elements to contain the images

			var my_img = $('<img></img>').attr('src', pic_url);

			if ($.browser.msie){ //if MSIE add queries to fool IE and have it reload the img everytime, therefore no cashing for IE!! 

				my_img.attr('src', pic_url + '?random=' + (new Date()).getTime());	

			}

			my_img 

			.attr('height', pic_height)

			.attr('width', pic_width)

			.hide()

			.bind("load",img_loaded)

			.appendTo($('<div></div>').addClass('_img_loading').css({

				'width': pic_width + 'px',

				'height':pic_height+ 'px'

			}));

			//Appending DIV wrapper to img holder container

			var img_div = my_img.parent();
            
            img_div.appendTo(_container)
        			.attr('id',pic_id)
        			.show();
            
            //Preload Image
            var pre_img = $('<img></img>').attr('src', pic_url_s);
			if ($.browser.msie){ //if MSIE add queries to fool IE and have it reload the img everytime, therefore no cashing for IE!! 
				pre_img.attr('src', pic_url_s + '?random=' + (new Date()).getTime());	
			}
			pre_img.attr('height', pic_height)
                   .attr('width', pic_width)
                   .addClass('pre_img')
                   .css('opacity',0.5)
                   .appendTo(img_div);
            
			
            
            
            
            
                


			//if images don't have widths or heights

			if (!my_img.width()) {

				alert("Please, fill in width & height for all your images!");

				return false;

			}

		}); //End of Images each func

		//setting updated my_pics array 

		_self.my_pics = images; 

		var totW = 0; //Total width of img holder, it will be the sum of all the images widths and border

		//Set the opacity of images. 

		_container.find('img').css('opacity',_opacity);

		//Getting img right margin to add to the total container width

		var photo_margin = parseInt(_container.find('div:first').css('border-right-width'));	 

		//Loop through all the divs in the img container

		$.each(_container.find('div'), function(i,value){

			var photo_w = parseInt($(this).css('width'));//adding all the widths including the right margin form the css file

			totW += photo_w+photo_margin;

		});

		//Set total length of image container

		_container.width(totW);

		//Setting up ajax listener "tm_gallery" that listenes for gallery to be completely loaded

		check_gall = function(){//Proxy function

			_self.check_gall_loaded();

		}

		_self.tm_gallery = setInterval(check_gall,500);

		//Loading on first img
        _self.go_to_pic(1);

		

	},//END OF DISPLAY FUNC//

	/*--SCROLLER function--*///Func that moves the slides left and right

scroller_mf: function(pos,calc){

		var _self = this;  

		var curr_pos=_self.current_pos;

		var elem = 0;

		var elem_w = 0;

		var _container = _self.container;

        var _gal_width = $(window).width(); //settin new GLOBAL width
	
		var x_init = parseInt($(_container).css('left'));

		var _opacity = _self.defaults.opacity;

		var totW = $(_container).width();

		if(!calc) // if calc variable not passed skip the appending and prepending

		{

			if(curr_pos<pos ){  //Chose direction pos=4/curr_pos=3

				//Append Out

				elem_w = $(_container+' div:first').width(); //grab width that will be lost

				$(_container+' div:first').appendTo(_container);

				//Holder Offset

				$(_container).css({'left':(x_init + elem_w)+'px'});

				pos -=1; 

			    }else{

				//Preppend Out

				elem_w = $(_container+' div:last').width(); //grab width that will be lost

				$(_container+' div:last').prependTo(_container);

				//Holder Offset

				$(_container).css({'left':(x_init - elem_w)+'px'});

				pos +=1; 

			}

		}

		//dim down all images within the container

		$(_container+' img').stop().animate({'opacity':_opacity}); 

		//Calculating the new position of the img container based on the img to be slided

		var my_img = $(_container+' div:eq('+pos+')');//DIV to be slided

		var photo_w = my_img.width();//Width of DIV

		var photo_margin = parseInt(my_img.css('border-right-width')); //consider border

		//var pic_offset = Math.round((_gal_width - photo_w)/2); //Calculate offset, so img will be centered

		var pic_offset = (_gal_width - photo_w)/2; //Calculate offset, so img will be centered

		

		var myPic = _self.pic_getter(my_img.attr('id')); //getting obj that matches div id

		var div_pos = my_img.position();//calculating the relative position of DIV to its container

		//Calculating the container x position for that specific img

		myPic.x_pos =  -( div_pos.left - pic_offset); 

		//Set new position DIV index

		_self.current_pos = pos;

		//Getting current img gallery index

		var pic_index = _self.pic_getter(my_img.attr('id')).index;

		//Updating META_DATA Information

		_self.meta_data.index = pic_index+1; //add one to account for incex=0  

		//Opacity = 1 for IMG to be slided 
        if(!my_img.hasClass('_img_loading')) {  //If image it's has been loaded'
		
        my_img.find('img').stop().animate({'opacity':'1'});
        
        }

		//Holder Animation

		if(calc)

		{

		// if only to be calculated Don't animate 

		$(_container).stop().css('left',myPic.x_pos + 'px');

		}else{

		//Container Slide Animation

		$(_container).stop().animate({'left': myPic.x_pos + 'px'}, 'normal', 'swing');	  

		}

		

		//Call Event Listener when the pic has been updated in the gallery

		_self.check_pic_has_changed();

		

	},//End of scroller_mf

	/*--GO_TO_PIC function--*/ //Go to any picture in the container and center it in the middle of the container

go_to_pic: function(i){

		var _self = this;  

		var curr_pos=_self.current_pos;

		var _container = _self.container;

		var n_divs =$(_container+' div').length; //total number of divs inside container

		

		i--; //Making sure index matches gallery convention

		if (i > n_divs || i<0){ //If the query is greater than the number of DIV, scape function

			i=0;

		}

		//Get DIV position of query request

		var div_pos = $(_container+' div[id=bi_photo_'+i+']').index(); 

		//Get center of block of divs, squew for upper limit

		var center = Math.ceil(n_divs/2); 

		//Get diffferential of center and wanted div_pos is

		var diff = (center - div_pos)-1;

		

		var j = 0;

		//if diff is Positive, it means that the query is under the center, divs will need to take from end of the row to the begining of row is

		if (diff>0){

			while (j<diff)

			{

				j++;

				$(_container+' div:last').prependTo(_container)

				

			}

		//if diff is Negative, it means that the query is over the center, divs will need to take from begining  of the row to the end of the row is

		}else if(diff<0){

			while (j>diff)

			{

				j--;

				$(_container+' div:first').appendTo(_container)

				

			}

		}

		//After all divs have been switched around, get the div pos of our query 

		var new_div_pos = $(_container+' div[id=bi_photo_'+i+']').index();

		//Move to that div location, making sure it's a non-animation transition

		

		this.scroller_mf(new_div_pos, true);

	}, //End of go_to_pic

	/*FULL SCREEN function*/ //Sets full-screen mode on and off

full_screen: function(n_height){

		var _self = this;

		var gall_wrap = $(_self.defaults.gall_holder);

		var n_width = '100%';

		var _gal_width = _self.defaults.gal_width;

		var _gal_height = _self.defaults.gal_height;

		var _container =  $(_self.container);

		var _gall_ctrl = $(_self.gall_ctrl);
        
        var is_on = false;
		

		n_height = $(window).height() - _self.fs_offset;//0.75*(screen.height);



		if(!$('#bi_gall_temp').exists()) //If full_screen is not on 

		{  
            
            //create temp hook for META INFO and plug it inside the light box

			_gall_ctrl.wrap('<div id="bi_ctrl_temp" />');

			_gall_ctrl.addClass('port_ctrl_fscre').appendTo('#bi_light_box');

			_gall_ctrl.find('#sec_cat').hide();

			_gall_ctrl.find('#thi_cat p').css({'font-size':'20px'})

			gall_wrap.wrap('<div id="bi_gall_temp" />');

			gall_wrap.appendTo('#bi_light_box');

			$('.full_scr_btn').addClass('full_scr_big');



			//add lightbox

			_self.light_box();

			//Scroll to the top of the page 

			$('html,body').data('curr_scroll',$('html,body').scrollTop());

			$('html,body').scrollTop(0);

			var o_wid = _gal_width;

			var o_hei = _gal_height;



			gall_wrap.data('dims',{o_width:o_wid, o_height:o_hei});



			gall_wrap.css({'width': n_width,

				'height':n_height			

			}).addClass('full_screen');

			_self.defaults.gal_width = $(window).width(); //settin new GLOBAL width

			_self.defaults.gal_height = n_height;         //settin new GLOBAL height

           //Turnig it on 
           _self.fs_on = true;
            
            
		}else{ //if Full screen is ON

		   var o_wid = gall_wrap.data('dims').o_width;
             if(typeof(o_wid) === 'string'){ 
                if(o_wid.search(/\%/) === -1 )
                o_wid = parseInt(o_wid);
             }else{
                o_wid = parseInt(o_wid);
             }
		 var o_hei = gall_wrap.data('dims').o_height;	
            if(typeof(o_hei) === 'string'){
           
                if(o_hei.search(/\%/) === -1 )
                o_hei = parseInt(o_hei);
			}else{
                o_hei = parseInt(o_hei);
			}

			gall_wrap.css({'width': o_wid,'height':o_hei}).removeClass('full_screen');;

			

			//Resetting Scroll section

			var o_scroll_pos = $('html,body').data('curr_scroll');

			$('html,body').scrollTop(o_scroll_pos);

			//$(window).unbind();

			_self.defaults.gal_width =o_wid;

			n_height = o_hei;

			_self.defaults.gal_height= n_height; //go back to normal

			//remove lightbox

			_self.light_box();



			//relocate and remove temp hooks

			gall_wrap.insertAfter('#bi_gall_temp');

			$('#bi_gall_temp').remove();



			_gall_ctrl.removeClass('port_ctrl_fscre').insertAfter('#bi_ctrl_temp');

			_gall_ctrl.find('#sec_cat').show();

			_gall_ctrl.find('#thi_cat p').css({'font-size':'15px'})

			$('#bi_ctrl_temp').remove();

			$('.full_scr_btn').removeClass('full_scr_big');
            
            //Turnig it off
           _self.fs_on = false;

		}



		//Centering Elements

		_self.center_elems();



		var tot_width = 0;

		

		var photo_margin = parseInt($(_container).find('div:first').css('border-right-width'));	 



		$.each($(_container).find('div'), function(i,value){



			var img_div = $(value);



			var pic_ratio = img_div.width() / img_div.height();

			var pic_width = Math.round(n_height * pic_ratio)	; //converting to string

			var pic_height = n_height;

			

			img_div.css({'width': pic_width,

				'height':pic_height})

			

			img_div.find('img').width(pic_width);

			img_div.find('img').height(pic_height);

			

			tot_width+=pic_width + photo_margin ;

			

		}); //End of each func



		_container.width(tot_width);



		_self.scroller_mf(_self.current_pos, true);



	}, 

	/*LIGHT_BOX func*/ 

light_box:function(){

		var wrap = $('#bi_light_box');

		if( wrap.css('display')!= "block")

		{

			wrap.show();

			$('body').css({'overflow':'hidden'});	

		}

		else{

			wrap.hide();

			$('body').css({'overflow':'auto'});	

			

		}



	},

	/*TIMER Func*/ //Creates a timer that scrolls the gallery every given time*/

timer: function(toggle){

		// toggle=false;

		var _self = this;

		var time = _self.defaults.timer_prd;
        
        //proxy function that lauches the scrolling function evey given time  
        scroll_mf = function(){

			_self.scroller_mf(_self.current_pos+1);	

		}



		if (toggle){

			clearInterval(_self.timer_id);

			_self.timer_id = setInterval(scroll_mf,time);

		}else

		{

			//Unbind gallery from hover event and stop timer

			clearInterval(_self.timer_id)

		}

	},

	/*CENTER ELEMS Func*/ //Center elements within the gallery holder 

center_elems:function(){

		var _self = this;

		var _gal_width = _self.defaults.gal_width;

		var _gal_height = _self.defaults.gal_height;

		

		//Center gallery nav buttons

		var nav_center = Math.round((_gal_height - parseInt($('.gall_btn').css('height')))/2);

		$('.gall_btn').css({'top':nav_center+'px'})

		

	},

/*Cleaning Gall Func*/ //Center elements within the gallery holder 	

cleaning_gall:function(){

		var _self = this;

		

		_self.ajax_list.meta_data = false;

		_self.ajax_list.all_pics = 0;

},	

/*--CUSTOM EVENT LISTENERS--*/

	/*Gallery Loaded func*/

check_gall_loaded:function(){

		var _self = this;

		var  ajax = _self.ajax_list; //List of ajax checks

		if(ajax.meta_data)

		{

			//Callback func that gets called when meta_data is filled

			$.isFunction(this.GALL_Loaded) && this.GALL_Loaded(); //Call_back function 

			//Kill gall Timer

			clearInterval(_self.tm_gallery)	   

		}

		

		//TIME OUT gall Timer in 3500

		setTimeout(function (){

			clearInterval(_self.tm_gallery)

		},

		3500

		);

	},

	/*CHECK ALL PICS Func*/ //If All Pictures are Loaded

check_all_pics:function(){
	
        this.gall_holder_listener();
        
		$.isFunction(this.PICS_Loaded) && this.PICS_Loaded(); //Call_back function

	},

	/*PIC HAS CHANGED Func*/ //If All Pictures are Loaded

check_pic_has_changed:function(){

		var _self = this;

		$.isFunction(this.PIC_Changed) && this.PIC_Changed(); //Call_back function

	},

	/*TOGGLE Func*/ //Turns the gallery on or off

get_holder: function () {
    
    return $(this.defaults.gall_holder);
    
},

set_timer: function (setting) {
    
    var _self = this;
     
    switch(setting){
        
    case 'off':
         _self.defaults.automatic = false;
         _self.timer(false);
         _self.gall_holder_listener();
         
          break;
         
    case 'on':                
         _self.defaults.automatic = true; 
         _self.timer(true);
         _self.gall_holder_listener();
          break;
    
    default:    
         _self.defaults.automatic = false;
         _self.timer(false);
         _self.gall_holder_listener();
    }
},

//SEts or Unsets hover listeners for gallery holder 
gall_holder_listener: function(){
    
    	var _self = this;
		var gall_wrap = $(_self.defaults.gall_holder);

            if(_self.defaults.automatic){ //Check default settings

			 //Timer Event Listeners

    			gall_wrap.hover( // hover over gallery stop timer, 
            		function(){ //OVER
            			_self.timer(false);
        			},
        			function(){  //OUT
        				_self.timer(true);
            		})

		   }else{
		      
              gall_wrap.unbind();
              
		   }
  
}
} /*--END OF Slider obj--*/



