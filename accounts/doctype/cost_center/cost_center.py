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
from webnotes.model.wrapper import getlist
from webnotes import msgprint

from webnotes.utils.nestedset import DocTypeNestedSet

class DocType(DocTypeNestedSet):
	def __init__(self,d,dl):
		self.doc, self.doclist = d,dl
		self.nsm_parent_field = 'parent_cost_center'
				
	def autoname(self):
		company_abbr = webnotes.conn.sql("select abbr from tabCompany where name=%s", 
			self.doc.company_name)[0][0]
		self.doc.name = self.doc.cost_center_name + ' - ' + company_abbr		
		
	def validate_mandatory(self):
		if not self.doc.group_or_ledger:
			msgprint("Please select Group or Ledger value", raise_exception=1)
			
		if self.doc.cost_center_name != 'Root' and not self.doc.parent_cost_center:
			msgprint("Please enter parent cost center", raise_exception=1)
		
	def convert_group_to_ledger(self):
		if self.check_if_child_exists():
			msgprint("Cost Center: %s has existing child. You can not convert this cost center to ledger" % (self.doc.name), raise_exception=1)
		elif self.check_gle_exists():
			msgprint("Cost Center with existing transaction can not be converted to ledger.", raise_exception=1)
		else:
			self.doc.group_or_ledger = 'Ledger'
			self.doc.save()
			return 1
			
	def convert_ledger_to_group(self):
		if self.check_gle_exists():
			msgprint("Cost Center with existing transaction can not be converted to group.", raise_exception=1)
		else:
			self.doc.group_or_ledger = 'Group'
			self.doc.save()
			return 1

	def check_gle_exists(self):
		return webnotes.conn.sql("select name from `tabGL Entry` where cost_center = %s and \
			ifnull(is_cancelled, 'No') = 'No'", (self.doc.name))
		
	def check_if_child_exists(self):
		return webnotes.conn.sql("select name from `tabCost Center` where \
			parent_cost_center = %s and docstatus != 2", self.doc.name)

	def validate_budget_details(self):
		check_acc_list = []
		for d in getlist(self.doclist, 'budget_details'):
			if self.doc.group_or_ledger=="Group":
				msgprint("Budget cannot be set for Group Cost Centers", raise_exception=1)
				
			if [d.account, d.fiscal_year] in check_acc_list:
				msgprint("Account " + d.account + "has been entered more than once for fiscal year " + d.fiscal_year, raise_exception=1)
			else: 
				check_acc_list.append([d.account, d.fiscal_year])

	def validate(self):
		"""
			Cost Center name must be unique
		"""
		if (self.doc.__islocal or not self.doc.name) and webnotes.conn.sql("select name from `tabCost Center` where cost_center_name = %s and company_name=%s", (self.doc.cost_center_name, self.doc.company_name)):
			msgprint("Cost Center Name already exists, please rename", raise_exception=1)
			
		self.validate_mandatory()
		self.validate_budget_details()
		
	def on_rename(self, new, old):
		company_abbr = webnotes.conn.get_value("Company", self.doc.company_name, "abbr")		
		parts = new.split(" - ")	

		if parts[-1].lower() != company_abbr.lower():
			parts.append(company_abbr)

		# rename account name
		cost_center_name = " - ".join(parts[:-1])
		webnotes.conn.sql("update `tabCost Center` set cost_center_name = %s where name = %s", \
			(cost_center_name, old))

		return " - ".join(parts)	
