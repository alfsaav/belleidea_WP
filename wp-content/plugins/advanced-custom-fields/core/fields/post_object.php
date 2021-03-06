<?php

class acf_Post_object
{
	var $name;
	var $title;
	var $parent;
	
	function acf_Post_object($parent)
	{
		$this->name = 'post_object';
		$this->title = __("Post Object",'acf');
		$this->parent = $parent;
	}
	
	function html($field)
	{
		// options
		$options = $field->options;
		$options['meta_key'] = isset($options['meta_key']) ? $options['meta_key'] : '';
		$options['meta_value'] = isset($options['meta_value']) ? $options['meta_value'] : '';
		
		// get post types
		$post_types = isset($options['post_type']) ? $options['post_type'] : false;
		if(!$post_types || $post_types[0] == "")
		{
			$post_types = get_post_types(array('public' => true));
			foreach($post_types as $key => $value)
			{
				if($value == 'attachment')
				{
					unset($post_types[$key]);
				}
			}
		}
		
		// start select
		if(isset($field->options['multiple']) && $field->options['multiple'] == '1')
		{
			$name_extra = '[]';
			echo '<select id="'.$field->input_name.'" class="'.$field->input_class.'" name="'.$field->input_name.$name_extra.'" multiple="multiple" size="5" >';
		}
		else
		{
			echo '<select id="'.$field->input_name.'" class="'.$field->input_class.'" name="'.$field->input_name.'" >';	
			
			// add null
			if(isset($field->options['allow_null']) && $field->options['allow_null'] == '1')
			{
				echo '<option value="null"> - Select - </option>';
			}
		}
		
		// loop through post types
		foreach($post_types as $post_type)
		{
			// get posts
			$posts = false;
			
			if(is_post_type_hierarchical($post_type))
			{
				// get pages
				$posts = get_pages(array(
					'numberposts' => -1,
					'post_type' => $post_type,
					'sort_column' => 'menu_order',
					'order' => 'ASC',
					'meta_key' => $options['meta_key'],
					'meta_value' => $options['meta_value'],
				));
			}
			else
			{
				// get posts
				$posts = get_posts(array(
					'numberposts' => -1,
					'post_type' => $post_type,
					'orderby' => 'title',
					'order' => 'ASC',
					'meta_key' => $options['meta_key'],
					'meta_value' => $options['meta_value'],
				));
			} 
			
			
			// if posts, make a group for them
			if($posts)
			{
				echo '<optgroup label="'.$post_type.'">';
				
				foreach($posts as $post)
				{
					$key = $post->ID;
					
					$value = '';
					$ancestors = get_ancestors($post->ID, $post_type);
					if($ancestors)
					{
						foreach($ancestors as $a)
						{
							$value .= '– ';
						}
					}
					$value .= get_the_title($post->ID);

					$selected = '';
					
					
					if(is_array($field->value))
					{
						// 2. If the value is an array (multiple select), loop through values and check if it is selected
						if(in_array($key, $field->value))
						{
							$selected = 'selected="selected"';
						}
					}
					else
					{
						// 3. this is not a multiple select, just check normaly
						if($key == $field->value)
						{
							$selected = 'selected="selected"';
						}
					}	
					
					
					echo '<option value="'.$key.'" '.$selected.'>'.$value.'</option>';
					
					
				}	
				
				echo '</optgroup>';
				
			}// endif
		}// endforeach
		

		echo '</select>';
	}
	
	
	/*---------------------------------------------------------------------------------------------
	 * Options HTML
	 * - called from fields_meta_box.php
	 * - displays options in html format
	 *
	 * @author Elliot Condon
	 * @since 1.1
	 * 
	 ---------------------------------------------------------------------------------------------*/
	function options_html($key, $field)
	{
		$options = $field->options;
		
		$options['post_type'] = isset($options['post_type']) ? $options['post_type'] : '';
		$options['multiple'] = isset($options['multiple']) ? $options['multiple'] : '0';
		$options['allow_null'] = isset($options['allow_null']) ? $options['allow_null'] : '0';
		$options['meta_key'] = isset($options['meta_key']) ? $options['meta_key'] : '';
		$options['meta_value'] = isset($options['meta_value']) ? $options['meta_value'] : '';
		
		?>
		
		<tr class="field_option field_option_post_object">
			<td class="label">
				<label for=""><?php _e("Post Type",'acf'); ?></label>
				<p class="description"><?php _e("Filter posts by selecting a post type<br />
				Tip: deselect all post types to show all post type's posts",'acf'); ?></p>
			</td>
			<td>
				<?php 
				$post_types = array('' => '-All-');
				
				foreach (get_post_types() as $post_type ) {
				  $post_types[$post_type] = $post_type;
				}
				
				unset($post_types['attachment']);
				unset($post_types['nav_menu_item']);
				unset($post_types['revision']);
				unset($post_types['acf']);
				

				$temp_field = new stdClass();	
				$temp_field->type = 'select';
				$temp_field->input_name = 'acf[fields]['.$key.'][options][post_type]';
				$temp_field->input_class = '';
				$temp_field->value = $options['post_type'];
				$temp_field->options = array('choices' => $post_types, 'multiple' => '1');
				$this->parent->create_field($temp_field); 
				
				?>
				
			</td>
		</tr>
		<tr class="field_option field_option_post_object">
			<td class="label">
				<label><?php _e("Filter Posts",'acf'); ?></label>
				<p class="description"><?php _e("Where meta_key == meta_value",'acf'); ?></p>
			</td>
			<td>
				<div style="width:45%; float:left">
				<?php 
					$temp_field->type = 'text';
					$temp_field->input_name = 'acf[fields]['.$key.'][options][meta_key]';
					$temp_field->input_class = '';
					$temp_field->value = $options['meta_key'];
					$this->parent->create_field($temp_field); 
				?>
				</div>
				<div style="width:10%; float:left; text-align:center; padding:5px 0 0;">is equal to</div>
				<div style="width:45%; float:left">
				<?php 
					$temp_field->type = 'text';
					$temp_field->input_name = 'acf[fields]['.$key.'][options][meta_value]';
					$temp_field->input_class = '';
					$temp_field->value = $options['meta_value'];
					$this->parent->create_field($temp_field); 
				?>
				</div>
			</td>
		</tr>
		<tr class="field_option field_option_post_object">
			<td class="label">
				<label><?php _e("Allow Null?",'acf'); ?></label>
			</td>
			<td>
				<?php 
					$temp_field = new stdClass();	
					$temp_field->type = 'true_false';
					$temp_field->input_name = 'acf[fields]['.$key.'][options][allow_null]';
					$temp_field->input_class = '';
					$temp_field->value = $options['allow_null'];
					$temp_field->options = array('message' => 'Add null value above choices');
					$this->parent->create_field($temp_field); 
				?>
			</td>
		</tr>
		<tr class="field_option field_option_post_object">
			<td class="label">
				<label><?php _e("Select multiple values?",'acf'); ?></label>
			</td>
			<td>
				<?php 
					$temp_field->type = 'true_false';
					$temp_field->input_name = 'acf[fields]['.$key.'][options][multiple]';
					$temp_field->input_class = '';
					$temp_field->value = $options['multiple'];
					$temp_field->options = array('message' => 'Turn this drop-down into a multi-select');
					$this->parent->create_field($temp_field); 
				?>
			</td>
		</tr>

		<?php
	}
	
	
	
	
	/*---------------------------------------------------------------------------------------------
	 * Format Value
	 * - this is called from api.php
	 *
	 * @author Elliot Condon
	 * @since 1.1
	 * 
	 ---------------------------------------------------------------------------------------------*/
	function format_value_for_api($value, $options = null)
	{
		$value = $this->format_value_for_input($value);
		
		if($value == 'null')
		{
			return false;
		}
		
		if(!$value)
		{
			return false;
		}
		
		if(is_array($value))
		{
			foreach($value as $k => $v)
			{
				$value[$k] = get_post($v);
			}
		}
		else
		{
			$value = get_post($value);
		}
		
		return $value;
	}
	
	
	/*---------------------------------------------------------------------------------------------
	 * Format Value for input
	 * - this is called from api.php
	 *
	 * @author Elliot Condon
	 * @since 1.1
	 * 
	 ---------------------------------------------------------------------------------------------*/
	function format_value_for_input($value)
	{
		$is_array = @unserialize($value);
		
		if($is_array)
		{
			return unserialize($value);
		}
		else
		{
			return $value;
		}
		
	}
	
}

?>