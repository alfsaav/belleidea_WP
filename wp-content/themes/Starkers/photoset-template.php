<?php
/*
Template Name: Photoset
*/
/**
 Setting up Defaults 
 * *******/
//Setting up JS defaults
//Generatates custom script tags to be included in header
add_action('wp_head', 'js_agro_wrap');
function js_agro_wrap(){ 
    
    $wp_temp_dir = get_bloginfo('template_directory'); 
    $js_array_includes = array(
                               $wp_temp_dir.'/js/photo/bi_img_slider.js',
                               $wp_temp_dir.'/js/photo/bi_thumbs.js',
                               $wp_temp_dir.'/js/photo/gallery_pg.js'
                               ); /// -> Include js array ("filea.js","fileb.js"...);
    
    js_aggregator($js_array_includes);
}
/**
End of Defaults
*/
//Catching slug from URL
$set_slug =  pods_url_variable('last');
$set = new Pod('photosets', $set_slug);
$flickr_id = $set->get_field('flickr_id');

//Making sure its a valid ID, if not redirect to 404 page
if( empty($flickr_id) ){
     wp_redirect( '/404.php' ); exit;
}
//Get Photos array
//Init flickr 
$flickr = new Flickr();
//Get Photos from Flickr
$gall_v = $flickr->get_photos($flickr_id); 

/**
 * Adding Sub Header NavMenu  
 */
$nav_menu_params = array(
                       'parent_title' => $set->get_field('collection'),
                       'title' =>  $set->get_field('name'),
                       'n_pics' => $gall_v['n_pics']
                        );
$page_submenu = gall_nav_menu($nav_menu_params);

//Sending photos to thumbs factory func //pod_templates/photo_funcs.php

$th_params = array (  'id_alias' => 'image',
					  'id' => 'gallery',
					  'thumbs' => $gall_v['pics'],
					  'link_root' => '#pic=',
					  'thumb_size' => 172,
					  't_tip_size' => 230,
					  'show' => true
           );
$thumbs_html = thumbs_factory($th_params);

//Photo Slider Content in JSON

$BI_global = json_encode($gall_v); //JSON Object for javascript
	        
require('header.php') 

?>
<script type="text/javascript">

	//Global JSON Object that holds vars coming from PHP

	var BI_GLOBAL = <?php echo $BI_global ?>; //JSON object full of 

	
</script>
<!--Body Wrapper-->
<div class="page_default with_sub_menu"> 

<!-- Photo Slider comes here -->
<div id="web_gallery" class="photo_elem hidden"> </div>

<!-- Photo Thumbnails come here -->
<div id="image_gallery" class="wrapper thumbs photo_elem active">

    <?php 
    //Rendering thumbnails on page
    
    printf($thumbs_html); 
    
    ?>

</div><!--///Photo Thumbnails-->

</div><!--///Body Wrapper-->
        
<?php get_footer(); ?>