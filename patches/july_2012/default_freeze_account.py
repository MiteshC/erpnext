from __future__ import unicode_literals
def execute():
	import webnotes
	webnotes.conn.sql("""update tabAccount set freeze_account='No' where freeze_account is null""")
	webnotes.conn.sql("""update `tabPurchase Taxes and Charges` 
		set category='Valuation and Total' where category='For Both'""")
	webnotes.conn.sql("""update `tabPurchase Taxes and Charges` 
		set category='Valuation' where category='For Valuation'""")
	webnotes.conn.sql("""update `tabPurchase Taxes and Charges` 
		set category='Total' where category='For Total'""")	