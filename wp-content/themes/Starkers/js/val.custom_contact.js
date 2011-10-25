$(document).ready(function(){

// Regular Expression to test whether the value is valid
$.tools.validator.fn("[type=phone]", "Please supply a valid phone format", function(input, value) { 
	
	//return /^(\(?\d\d\d\)?)?( |-|\.)?\d\d\d( |-|\.)?\d{4,4}(( |-|\.)?[ext\.]+ ?\d+)?$/.test(value)
	
	var result = true;
	
	if(value !=""){	
      result= /^(\(?\d\d\d\)?)?( |-|\.)?\d\d\d( |-|\.)?\d{4,4}(( |-|\.)?[ext\.]+ ?\d+)?$/.test(value);
	}
	return result;
	
});

//This section of code adds some custom functionality to the validator tool. It makes it so it diplays the validation errors in an idependent div. NICE!
$.tools.validator.addEffect("wall", function(errors, event) {
	// get the message wall
	var wall = $(this.getConf().container).fadeIn();
	// remove all existing messages
	wall.find("p").remove();
	// add new ones
	$.each(errors, function(index, error) {
		wall.append(
			'<p><strong>'+error.input.attr("name")+ "</strong> " +error.messages[0]+ '</p>'
		);		
	});
// the effect does nothing when all inputs are valid	
}, function(inputs)  {

});


$("#cForm").validator({
   effect: 'wall', 
   container: '#comment_form_log',
   // do not validate inputs when they are edited
   errorInputEvent: null
// custom form submission logic  
}).submit(function(e)  { 
   // when data is valid 
   if (!e.isDefaultPrevented()) {
      // tell user that everything is OK
       var name = $("#fm_name").val();
	   var email = $("#fm_email").val();
	   var web = $("#fm_web").val();
	   var budget = $("#fm_budget").val();
       var message = $("#fm_message").val();

	   var datastr = "name=" + name + "&email=" + email + "&web=" + web + "&budget=" + budget + "&message=" + message; 
    	  
	    $("#comment_form_log").html("<p>Your message is being sent  <img src='/assets/img/ajax-loader_s.gif'/> </p>").fadeIn("slow").animate({opacity: 1.0}, 3000, function(){
	   //Force a delay of 3 secs, before sending email request to the server
	   send(datastr);
																																									       });
	  
	  
			 
      // prevent the form data being submitted to the server
      e.preventDefault();
   } 

});


});

function send(datastr){
	
	 
	 $.ajax({
		type:"POST",
		url:"/assets/serv/conf_email.php",
		data:datastr,
		cashe:false,
		success:function(data){
		
		$(':input','#cForm')
	   .not(':button, :submit, :reset, :hidden')
	   .val('')
	   .removeAttr('checked')
	   .removeAttr('selected');	
		
		$("#comment_form_log").
		html("<p>"+data+"</p>").
		fadeIn("slow").
		delay(3000).fadeOut();	
		
		}
	  });
	
	}