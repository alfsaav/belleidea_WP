<?php
/*
Plugin Name: PhotoSets Pods UI
Plugin URI: http://belleidea.com/
Description: Customized Pods UI for Photosets Pod
Version: 0.1
Author: Alfredo Saavedra
Author URI: http://belleidea.com/
*/

function pods_ui_photoset()
{
  $icon = ''; 
  add_object_page('Photosets', 'Photoset', 'read', 'photoset', '', $icon);
  add_submenu_page('photoset', 'Manage Photosets', 'Manage', 'read', 'photoset', 'photoset_page'); 
  add_submenu_page('photoset', 'Add New Photoset', 'Add new', 'read', 'photoset&action=add', 'photoset_add_page');
}

function photoset_page()
{
  $object = new Pod('photosets');
  $add_fields = $edit_fields = array(
                    'name',
                    'slug',
                    'collection',
                    'flickr_id',
                    'pub_date',
                    'thumb_pic');
  $object->ui = array(
                    'title'   => 'Photosets',
                    'columns' => array(
                              'thumb_pic' => array('label'=>'Thumbnail','display_helper'=>'pods_ui_column_thumbnail' ),
                              'name'      => 'Name',
                              'collection'  => 'Collection',
                              'flickr_id'   => 'Flickr ID',
                              'pub_date'  => array('label'=>'Published','display_helper'=>'pods_ui_date_format'), 
                              'modified'  => 'Last Modified'
                              ),
                    'add_fields'  => $add_fields,
                    'edit_fields' => $edit_fields,
                    'search_across' => true,
                    'search_across_picks' => true,
                    'filters' => array('collection'),
                    'sort' => 'pub_date DESC'
					);
  pods_ui_manage($object);
}
function photoset_add_page(){}

add_action('admin_menu','pods_ui_photoset');

?>