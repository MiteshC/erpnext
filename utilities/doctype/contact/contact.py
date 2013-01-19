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


from utilities.transaction_base import TransactionBase

class DocType(TransactionBase):	
	def __init__(self, doc, doclist=[]):
		self.doc = doc
		self.doclist = doclist

	def onload(self):
		self.add_communication_list()

	def autoname(self):
		if self.doc.customer:
			self.doc.name = self.doc.first_name + (self.doc.last_name and ' ' + self.doc.last_name or '') + '-' + self.doc.customer
		elif self.doc.supplier:
			self.doc.name = self.doc.first_name + (self.doc.last_name and ' ' + self.doc.last_name or '') + '-' + self.doc.supplier
		elif self.doc.sales_partner:
			self.doc.name = self.doc.first_name + (self.doc.last_name and ' ' + self.doc.last_name or '') + '-' + self.doc.sales_partner	
		else:
			self.doc.name = self.doc.first_name + (self.doc.last_name and ' ' + self.doc.last_name or '')

	def validate(self):
		self.validate_primary_contact()

	def validate_primary_contact(self):
		sql = webnotes.conn.sql
		if self.doc.is_primary_contact == 1:
			if self.doc.customer:
				sql("update tabContact set is_primary_contact=0 where customer = '%s'" % (self.doc.customer))
			elif self.doc.supplier:
				sql("update tabContact set is_primary_contact=0 where supplier = '%s'" % (self.doc.supplier))	
			elif self.doc.sales_partner:
				sql("update tabContact set is_primary_contact=0 where sales_partner = '%s'" % (self.doc.sales_partner))
		else:
			if self.doc.customer:
				if not sql("select name from tabContact where is_primary_contact=1 and customer = '%s'" % (self.doc.customer)):
					self.doc.is_primary_contact = 1
			elif self.doc.supplier:
				if not sql("select name from tabContact where is_primary_contact=1 and supplier = '%s'" % (self.doc.supplier)):
					self.doc.is_primary_contact = 1
			elif self.doc.sales_partner:
				if not sql("select name from tabContact where is_primary_contact=1 and sales_partner = '%s'" % (self.doc.sales_partner)):
					self.doc.is_primary_contact = 1

	def on_trash(self):
		webnotes.conn.sql("""update tabCommunication set contact='' where contact=%s""",
			self.doc.name)
		webnotes.conn.sql("""update `tabSupport Ticket` set contact='' where contact=%s""",
			self.doc.name)