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

from webnotes.utils import getdate, today
from webnotes.model import db_exists
from webnotes.model.wrapper import copy_doclist
from webnotes import msgprint

sql = webnotes.conn.sql

class DocType:
	def __init__(self,doc,doclist=[]):
		self.doc = doc
		self.doclist = doclist
	
	def get_project_details(self):
		cust = sql("select customer, customer_name from `tabProject` where name = %s", self.doc.project)
		if cust:
			ret = {'customer': cust and cust[0][0] or '', 'customer_name': cust and cust[0][1] or ''}
			return ret

	def get_customer_details(self):
		cust = sql("select customer_name from `tabCustomer` where name=%s", self.doc.customer)
		if cust:
			ret = {'customer_name': cust and cust[0][0] or ''}
			return ret
	
	def validate(self):
		if self.doc.exp_start_date and self.doc.exp_end_date and getdate(self.doc.exp_start_date) > getdate(self.doc.exp_end_date):
			msgprint("'Expected Start Date' can not be greater than 'Expected End Date'")
			raise Exception
		
		if self.doc.act_start_date and self.doc.act_end_date and getdate(self.doc.act_start_date) > getdate(self.doc.act_end_date):
			msgprint("'Actual Start Date' can not be greater than 'Actual End Date'")
			raise Exception
			
		self.update_status()

	def update_status(self):
		status = webnotes.conn.get_value("Task", self.doc.name, "status")
		if self.doc.status=="Working" and status !="Working" and not self.doc.act_start_date:
			self.doc.act_start_date = today()
			
		if self.doc.status=="Closed" and status != "Closed" and not self.doc.act_end_date:
			self.doc.act_end_date = today()
		