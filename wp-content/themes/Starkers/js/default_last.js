$(document).ready(function() {

//TWITTER PLUGIN SETTINGS
  $(".tweet").tweet({
            username: "alfsaav",
            join_text: "auto",
            count: 1,
			intro_text: null,                         // [string]   do you want text BEFORE your your tweets?
            outro_text: null,                         // [string]   do you want text AFTER your tweets?
            join_text:  null, 
            auto_join_text_default: null, 
            auto_join_text_ed: "we",
            auto_join_text_ing: "we were",
            auto_join_text_reply: "we replied to",
            auto_join_text_url: "we were checking out",
            loading_text: "Loading tweet!"
        });

})