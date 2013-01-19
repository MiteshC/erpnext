# For license information, please see license.txt

from __future__ import unicode_literals
import webnotes

class DocType:
	def __init__(self, d, dl):
		self.doc, self.doclist = d, dl
		
	def on_update(self):
		"""clear web cache"""
		from website.utils import clear_cache
		clear_cache()
		
		if self.doc.default_product_category:
			webnotes.model_wrapper("Item Group", 
				self.doc.default_product_category).save()