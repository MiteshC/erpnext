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

wn.require('app/setup/doctype/contact_control/contact_control.js');

cur_frm.cscript.onload = function(doc,dt,dn){
	
}

cur_frm.cscript.refresh = function(doc,dt,dn) {
  if(sys_defaults.supp_master_name == 'Supplier Name')
    hide_field('naming_series');
  else
    unhide_field('naming_series'); 
    
  if(doc.__islocal){
    	hide_field(['address_html','contact_html']); 
   }
  else{
	  	unhide_field(['address_html','contact_html']);
		// make lists
		cur_frm.cscript.make_address(doc,dt,dn);
		cur_frm.cscript.make_contact(doc,dt,dn);
		
		cur_frm.communication_view = new wn.views.CommunicationList({
			list: wn.model.get("Communication", {"supplier": doc.name}),
			parent: cur_frm.fields_dict.communication_html.wrapper,
			doc: doc
		})		
  }
}

cur_frm.cscript.make_address = function() {
	if(!cur_frm.address_list) {
		cur_frm.address_list = new wn.ui.Listing({
			parent: cur_frm.fields_dict['address_html'].wrapper,
			page_length: 2,
			new_doctype: "Address",
			custom_new_doc: function(doctype) {
				var address = wn.model.make_new_doc_and_get_name('Address');
				address = locals['Address'][address];
				address.supplier = cur_frm.doc.name;
				address.supplier_name = cur_frm.doc.supplier_name;
				address.address_title = cur_frm.doc.supplier_name;

				if(!(cur_frm.address_list.data && cur_frm.address_list.data.length)) {
					address.address_type = "Office";
				}
				
				wn.set_route("Form", "Address", address.name);
			},
			get_query: function() {
				return "select name, address_type, address_line1, address_line2, city, state, country, pincode, fax, email_id, phone, is_primary_address, is_shipping_address from tabAddress where supplier='"+cur_frm.docname+"' and docstatus != 2 order by is_primary_address desc"
			},
			as_dict: 1,
			no_results_message: 'No addresses created',
			render_row: cur_frm.cscript.render_address_row,
		});
		// note: render_address_row is defined in contact_control.js
	}
	cur_frm.address_list.run();
}

cur_frm.cscript.make_contact = function() {
	if(!cur_frm.contact_list) {
		cur_frm.contact_list = new wn.ui.Listing({
			parent: cur_frm.fields_dict['contact_html'].wrapper,
			page_length: 2,
			new_doctype: "Contact",
			custom_new_doc: function(doctype) {
				var contact = wn.model.make_new_doc_and_get_name('Contact');
				contact = locals['Contact'][contact];
				contact.supplier = cur_frm.doc.name;
				contact.supplier_name = cur_frm.doc.supplier_name;
				wn.set_route("Form", "Contact", contact.name);
			},
			get_query: function() {
				return "select name, first_name, last_name, email_id, phone, mobile_no, department, designation, is_primary_contact from tabContact where supplier='"+cur_frm.docname+"' and docstatus != 2 order by is_primary_contact desc"
			},
			as_dict: 1,
			no_results_message: 'No contacts created',
			render_row: cur_frm.cscript.render_contact_row,
		});
		// note: render_contact_row is defined in contact_control.js
	}
	cur_frm.contact_list.run();
}