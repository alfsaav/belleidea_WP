$(document).ready(function() {

$(".box_serv_bd a").click(function(){
											   
			$(".serv_list").slideToggle();
			$.each($(this).find('div'),function(index, val){
				
				if($(val).css('display')=='none'){
			    $(val).show();
				}else{
				$(val).hide();	
				}
            });
											   
   });
						   
});