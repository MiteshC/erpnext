import webnotes

def execute():
	webnotes.reload_doc("core", "doctype", "docfield")
	webnotes.conn.sql("""update tabDocField set print_width = width""")