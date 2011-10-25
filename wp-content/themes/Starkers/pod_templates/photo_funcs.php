<?php
/**
 * @author Alfredo 
 * @copyright 2011
 * Description: Template funcs that generate the HTML for different components of the site. 
 */
/**
 * This Method generates the HTML for the thumbs for all the galleries. 
 * */
function thumbs_collections($photosets){ //photoset Pod obj

        global $fire;
        
        
        while ( $photosets->fetchRecord() ) : 
        
              // set our variables
              $set_id        = $photosets->get_field('flickr_id');
              $set_title      = $photosets->get_field('name');
              $set_pub_date  = $photosets->get_field('pub_date');
              $set_thumb    = $photosets->get_field('thumb_pic');
              $set_slug    = $photosets->get_field('slug');
              $set_collection = $photosets->get_field('collection');
              $set_collection = $set_collection[0]['slug'];
              
              // data cleanup
              $set_pub_date = date('m.d.Y', strtotime($set_pub_date));
              if( !empty( $set_thumb ) ){
                  
                  list( $src, $width, $height) = wp_get_attachment_image_src( $set_thumb[0]['ID'], 'medium');
              }else{
                  
                  $src = $photosets->get_field('primary');               
                  //list($width, $height) = getimagesize($src);      
              }    
              if( !empty( $width )){              
                  $ratio = $height/$width;
                  //Max side of image
                  $dim_1 = 300;
                  
                  if($ratio >= 1){
                     $width_th= $dim_1;
                     $height_th = abs($width_th*$ratio);
                    
                  }else{
                    $height_th = $dim_1;
                    $width_th = abs($height_th/$ratio);
                  }  
                  
              }
            ?>
            
            <a class="bi-collection thumb <?php echo $set_collection; ?>" data-category="<?php echo $set_collection; ?>" href="/photo/<?php echo $set_slug; ?>">
               <img width="<?php echo $width_th; ?>" height="<?php echo $height_th; ?>" src="<?php echo $src; ?>" alt="hey"/>
               <div class="caption">
                    <h2><?php echo $set_title; ?></h2>
                    <div class="meta">
                        <span class="date"><?php echo $set_pub_date; ?></span>
                    </div>
                 </div>
            </a>
            <?php 
            
            endwhile; 
}//Endo of func

/**
 * This Method generates the HTML for the thumbs in a gallery specific page
 * */
function thumbs_factory($options)

	{
        $fire =  FirePHP::getInstance(true);//Set debugger 

		//Default Settings

		$defaults = array(  'id_alias' => 'my_images',

							'id' => 'my_thumbs',

							'thumbs' => '',

							'link_root' => '',

							'thumb_size' => 172,

							't_tip_size' => 230,

							'show' => 'true',

		);

		//Merging Settings

		$params = array_merge($defaults, $options );

		

		$id_alias = $params['id_alias'];

		$id = $params['id'];

		$show = $params['show'];

		$thumbs = $params['thumbs'];

		$link = $params['link_root'];

		//Setting dimension scale   

		$dim_1 = $params['thumb_size'];

		$dim_2 = $params['t_tip_size'];

		

		//Hide or show container

		if ($show){

			$display = 'block';

		}else{

			$display = 'none';

		}

		//Init return Thumbs HTML

        $myThumbs = ''; 

        //Loop throughout all the thumbnails    

		foreach($thumbs as $key => $set){

			global $console;    

			//scale thumbs to a fixed dimension ratio

			$ratio = $set['height_s']/$set['width_s'];

			if($ratio > 1){

				//Thumb Pic

				$height_th = $dim_1;

				$width_th = $height_th/$ratio;

				//Tooltip Pic

				$height_tip = $dim_2;

				$width_tip = $height_tip/$ratio;

			}else{

				//Thumb Pic

				$width_th = $dim_1;

				$height_th = $width_th*$ratio;

				//Tooltip Pic

				$width_tip = $dim_2;

				$height_tip = $width_tip*$ratio;

			}

			

			

			//Thumbnail Pattern

			

            $child_link = $link.($key+1);

			$thumb_data_1 = array($set['id'],$width_th,$height_th,$set['url_s'],$child_link);

			$thumb_data_2 = array(

								  $set['id'], $child_link, $width_tip, $height_tip, 

								  $set['url_s'],'',''

								  );

            $img_in_row = 10;

            $myThumbs .= vsprintf('<div class="thumb">
                                        <a class="image_cont" href="%5$s" id="div_%1$s">
                                            <img id="img_%1$s" width="%2$d" height="%3$d" src="%4$s"/>
                                        </a>
                                   </div>',$thumb_data_1);
            
            
            /*
            $myThumbs .= sprintf('<div class="thumb">%1$s %2$s </div>',

			vsprintf('<div class="image_cont" id="div_%1$s">

							<img id="img_%1$s" width="%2$d" height="%3$d" src="%4$s"/>

                      </div>',

			$thumb_data_1),

			vsprintf('<a class="thumb_tip" id="ctip_%1$s" href="%2$s" style="width:%3$dpx; height:%4$dpx;">

							<img  width="%3$d" height="%4$d" src="%5$s"/>

							%6$s %7$s

						</a>',

			$thumb_data_2)

			);
            
            */

		} //End of Foreach

		

		return  $myThumbs;    

	}//End of Method
/**
 *Generates specific Nav Menu for Gallery page
 * */
function gall_nav_menu( $params ){
    
    $parent_title = $params['parent_title'][0]['name'];
    $title = $params['title'];
    $n_pics = $params['n_pics'];
    
    $menu =  <<<EOT
    <div id='page_hd'>
    <div id="port_hd" class="wrapper">
            <!--First block-->
            <div id="gall_meta">
                <h1 class="back_btn">
               <a href="/photo/"> $parent_title</a> <!--Photography-->
                </h1> 
                <h2>
                 $title 
                    <span class="sl-mode">
                          <span id="current_pic_bi">1</span>
                          /<span id="total_pics_bi">$n_pics</span>
                    </span> 
                </h2>
            </div>
            <div id="gall_nav">
                 <a href='#'  class='thumbs' ></a>
                 <a href='#'  class='slider' ></a>
                 <a href='#' class='play sl-mode' ></a>
                 <a href='#' class='full_screen sl-mode'></a> 
            </div>
    
    </div><!--End of port_hd-->
</div>
<div class="menu_hd_lv3">
EOT;
    
    $menu .= wp_nav_menu( array( 'theme_location' => 'photography',
                                 'container_class' => 'wrapper coll_menu',
                                 'menu_class' => 'collec_nav',
                                 'echo' => false 
                                ) ); 
    $menu .= '   
    </div>
    <!--End of port_hd-->
</div>
  ';

//var_dump($menu);

return $menu;
    
}
/**
 *Generates HTML for Photography main menu
 * */
function photo_page_main_menu(){
    
   $menu = <<<EOT
    <div id='page_hd'>
            <div class="wrapper">
                  <!--First block-->
                  <h1>
                     Photography <!--Photography-->
                  </h1> 
                 <!--Navigation-->

EOT;
    $menu .= wp_nav_menu( array( 'theme_location' => 'photography',
                                 'menu_class' => 'collec_nav',
                                 'echo' => false 
                                ) ); 
                                  
               
    $menu .=  '</div></div>';
    
    return $menu;    

}

/**
 *Import Photosets from a specific coll from flickr
 * */
function import_collection( $coll_id ){
        
        $fire = FirePHP::getInstance(true);//Set debugger
        $flickr = new Flickr();
        $params = array(
        
        		'method'	=> 'flickr.collections.getTree',
        
        		'collection_id' => $coll_id,
        
        		'format'	=> 'php_serial'
        
        		);
        
        $rsp  = $flickr->REST($params);
        
        $fire->log($rsp['collections']['collection'],'Iterators');
        
        $rsp = $rsp['collections']['collection'][0];
        
        $coll_title = $rsp['title'];
        
        $pod_v = array(); //Array that will input set attributes in Photoset Pod
        
        foreach($rsp['set'] as $set){
                
                //Get more info from album
                $parms_1 = array(
            		'method'	=> 'flickr.photosets.getInfo',
            		'photoset_id' => $set['id'],
            		'format'	=> 'php_serial'
        		);
                
                $set_rsp  = $flickr->REST($parms_1);
                $pub_date = $set_rsp['photoset']['date_create'];
                $pub_date = date('Y-m-d G:i:s', $pub_date);
                $primary_pic = 'http://farm'.$set_rsp['photoset'][farm].'.static.flickr.com/'.$set_rsp['photoset'][server].'/'.$set_rsp['photoset'][primary].'_'.$set_rsp['photoset'][secret].'_z.jpg';
                
                $pod_v[] = array(
                                'name' => $set['title'],
                                'flickr_id' => $set['id'],
                                'pub_date' => $pub_date,
                                'collection' => $coll_title,
                                'primary' => $primary_pic
                              );
                              
                }
        
        $fire->log($pod_v);
        //Important data
        
        $api = new PodAPI('photosets', 'php');
        $api->import($pod_v);

}//End of Collection import func



?>