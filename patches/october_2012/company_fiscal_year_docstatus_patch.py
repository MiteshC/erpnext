import webnotes
def execute():
	webnotes.conn.sql("""update `tabCompany` set docstatus = 0
		where docstatus is null""")
		
	webnotes.conn.sql("""update `tabFiscal Year` set docstatus = 0
		where docstatus is null""")