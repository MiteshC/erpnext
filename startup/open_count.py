# ERPNext: Copyright 2013 Web Notes Technologies Pvt Ltd
# GNU General Public Licnese. See "license.txt"

from __future__ import unicode_literals
import webnotes

queries = {
	"Support Ticket": {"status":"Open"},
	"Customer Issue": {"status":"Open"},
	"Task": {"status":"Open"},
	"Lead": {"status":"Open"},
	"Opportunity": {"docstatus":0},
	"Quotation": {"docstatus":0},
	"Sales Order": {"docstatus":0},
	"Journal Voucher": {"docstatus":0},
	"Sales Invoice": {"docstatus":0},
	"Purchase Invoice": {"docstatus":0},
	"Leave Application": {"status":"Open"},
	"Expense Claim": {"approval_status":"Draft"},
	"Job Applicant": {"status":"Open"},
	"Purchase Receipt": {"docstatus":0},
	"Delivery Note": {"docstatus":0},
	"Stock Entry": {"docstatus":0},
	"Purchase Request": {"docstatus":0},
	"Purchase Order": {"docstatus":0},
	"Production Order": {"docstatus":0},
	"BOM": {"docstatus":0},
	"Timesheet": {"docstatus":0},
}