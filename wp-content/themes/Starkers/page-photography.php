<?php
/**
 * The template for displaying the Photo main page.
 *
 */
//Setting up JS defaults
//Generatates custom script tags to be included in header
add_action('wp_head', 'js_agro_wrap');
function js_agro_wrap(){ 
    
    $wp_temp_dir = get_bloginfo('template_directory'); 
    $js_array_includes = array(
                               $wp_temp_dir.'/js/isotope.js',
                               $wp_temp_dir.'/js/address.js',
                               $wp_temp_dir.'/js/photo/bi_thumbs.js',
                               $wp_temp_dir.'/js/photo/collection_pg.js'
                               ); /// -> Include js array ("filea.js","fileb.js"...);
    
    js_aggregator($js_array_includes);
}
/**
End of Defaults
*********/
//Setting Variables for Pods
$photosets = new Pod('photosets');
$photosets->findRecords('pub_date DESC', -1);
$n_sets = $photosets->getTotalRows();

//Setting up SubMenu
$page_submenu = photo_page_main_menu();

//Get Header
require('header.php');
 
?>

<!--Body Wrapper-->
<div class="wrapper page_default with_sub_menu"> 

        <?php if( $n_sets > 0 ) : ?>
          <div class="thumb_container photo_elem"  style="display: block;">
            <?php 
                //Generate Thumbs for all the galleries
                thumbs_collections($photosets) ?>
          </div>
        <?php endif; ?>
</div><!--///Body Wrapper-->        
        
<?php get_footer(); ?>