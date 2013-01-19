// ERPNext - web based ERP (http://erpnext.com)
// Copyright (C) 2012 Web Notes Technologies Pvt Ltd
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pscript['onload_Sales Browser'] = function(wrapper){
	wrapper.appframe = new wn.ui.AppFrame($(wrapper).find('.appframe-area'));
	wrapper.appframe.add_home_breadcrumb()
	wrapper.appframe.add_module_breadcrumb("Selling")
	
	wrapper.appframe.add_button('Refresh', function() {  
			wrapper.make_tree();
		}, 'icon-refresh');

	wrapper.make_tree = function() {
		var ctype = wn.get_route()[1] || 'Territory';
		wn.call({
			method: 'selling.page.sales_browser.sales_browser.get_children',
			args: {ctype: ctype},
			callback: function(r) {
				var root = r.message[0]["value"];
				erpnext.sales_chart = new erpnext.SalesChart(ctype, root, wrapper);
			}
		});
	}
	
	wrapper.make_tree();
}

pscript['onshow_Sales Browser'] = function(wrapper){
	// set route
	var ctype = wn.get_route()[1] || 'Territory';

	wrapper.appframe.set_title(ctype+' Tree')

	if(erpnext.sales_chart && erpnext.sales_chart.ctype != ctype) {
		wrapper.make_tree();
	}
};

erpnext.SalesChart = Class.extend({
	init: function(ctype, root, wrapper) {
		$(wrapper).find('.tree-area').empty();
		var me = this;
		me.ctype = ctype;
		this.tree = new wn.ui.Tree({
			parent: $(wrapper).find('.tree-area'), 
			label: root,
			args: {ctype: ctype},
			method: 'selling.page.sales_browser.sales_browser.get_children',
			click: function(link) {
				if(me.cur_toolbar) 
					$(me.cur_toolbar).toggle(false);

				if(!link.toolbar) 
					me.make_link_toolbar(link);

				if(link.toolbar) {
					me.cur_toolbar = link.toolbar;
					$(me.cur_toolbar).toggle(true);					
				}
			}
		});
		this.tree.rootnode.$a
			.data('node-data', {value: root, expandable:1})
			.click();		
	},
	make_link_toolbar: function(link) {
		var data = $(link).data('node-data');
		if(!data) return;

		link.toolbar = $('<span class="tree-node-toolbar"></span>').insertAfter(link);
		
		// edit
		var node_links = [];
		
		if (wn.model.can_read(this.ctype)) {
			node_links.push('<a onclick="erpnext.sales_chart.open();">Edit</a>');
		}

		if(data.expandable) {
			if (wn.boot.profile.can_create.indexOf(this.ctype) !== -1 ||
					wn.boot.profile.in_create.indexOf(this.ctype) !== -1) {
				node_links.push('<a onclick="erpnext.sales_chart.new_node();">Add Child</a>');
			}
		}

		if (wn.model.can_write(this.ctype)) {
			node_links.push('<a onclick="erpnext.sales_chart.rename()">Rename</a>');
		};
	
		if (wn.model.can_delete(this.ctype)) {
			node_links.push('<a onclick="erpnext.sales_chart.delete()">Delete</a>');
		};
		
		link.toolbar.append(node_links.join(" | "));
	},
	new_node: function() {
		var me = this;

		// the dialog
		var d = new wn.ui.Dialog({
			title:'New ' + me.ctype,
			fields: [
				{fieldtype:'Data', fieldname: 'name_field', label:'New ' + me.ctype + ' Name', reqd:true},
				{fieldtype:'Select', fieldname:'is_group', label:'Group Node',
					options:'No\nYes', description: "Further nodes can be only created under 'Group' type nodes"},
				{fieldtype:'Button', fieldname:'create_new', label:'Create New' }
			]
		})		
	
		d.set_value("is_group", "No");
		// create
		$(d.fields_dict.create_new.input).click(function() {
			var btn = this;
			$(btn).set_working();
			var v = d.get_values();
			if(!v) return;
			
			var node = me.selected_node();
			
			v.parent = node.data('label');
			v.ctype = me.ctype;
			
			wn.call({
				method: 'selling.page.sales_browser.sales_browser.add_node',
				args: v,
				callback: function() {
					$(btn).done_working();
					d.hide();
					node.trigger('reload');
				}	
			})			
		});
		d.show();		
	},
	selected_node: function() {
		return this.tree.$w.find('.tree-link.selected');
	},
	open: function() {
		var node = this.selected_node();
		wn.set_route("Form", this.ctype, node.data("label"));
	},
	rename: function() {
		var node = this.selected_node();
		wn.model.rename_doc(this.ctype, node.data('label'), function(new_name) {
			node.data('label', new_name).find(".tree-label").html(new_name);
		});
	},
	delete: function() {
		var node = this.selected_node();
		wn.model.delete_doc(this.ctype, node.data('label'), function() {
			node.parent().remove();
		});
	},
});