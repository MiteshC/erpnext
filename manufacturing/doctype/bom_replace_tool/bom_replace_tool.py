# ERPNext - web based ERP (http://erpnext.com)
# Copyright (C) 2012 Web Notes Technologies Pvt Ltd
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from __future__ import unicode_literals
import webnotes
from webnotes.utils import cstr, flt
from webnotes.model.code import get_obj
from webnotes import msgprint, _
	
class DocType:
	def __init__( self, doc, doclist=[]):
		self.doc = doc
		self.doclist = doclist
		
	def replace_bom(self):
		self.validate_bom()
		self.update_new_bom()
		bom_list = self.get_parent_boms()
		for bom in bom_list:
			bom_obj = get_obj("BOM", bom, with_children=1)
			bom_obj.update_cost_and_exploded_items()
			
		webnotes.msgprint(_("BOM replaced"))

	def validate_bom(self):
		if cstr(self.doc.current_bom) == cstr(self.doc.new_bom):
			msgprint("Current BOM and New BOM can not be same", raise_exception=1)
	
	def update_new_bom(self):
		current_bom_unitcost = webnotes.conn.sql("""select total_cost/quantity 
			from `tabBOM` where name = %s""", self.doc.current_bom)
		current_bom_unitcost = current_bom_unitcost and flt(current_bom_unitcost[0][0]) or 0
		webnotes.conn.sql("""update `tabBOM Item` set bom_no=%s, 
			rate=%s, amount=qty*%s where bom_no = %s and docstatus < 2""", 
			(self.doc.new_bom, current_bom_unitcost, current_bom_unitcost, self.doc.current_bom))
			
	def get_parent_boms(bom_no):
		return [d[0] for d in webnotes.conn.sql("""select distinct parent from
			`tabBOM Item` where ifnull(bom_no, '')=%s and docstatus < 2""", bom_no)]
	
	def get_parent_boms(self):
		return [d[0] for d in webnotes.conn.sql("""select distinct parent 
			from `tabBOM Item` where ifnull(bom_no, '') = %s and docstatus < 2""",
			self.doc.new_bom)]