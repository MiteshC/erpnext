// ERPNext: Copyright 2013 Web Notes Technologies Pvt Ltd
// GNU General Public License. See "license.txt"

wn.module_page["Accounts"] = [
	{
		title: wn._("Documents"),
		icon: "icon-copy",
		items: [
			{
				label: wn._("Journal Voucher"),
				description: wn._("Accounting journal entries."),
				doctype:"Journal Voucher"
			},
			{
				label: wn._("Sales Invoice"),
				description: wn._("Bills raised to Customers."),
				doctype:"Sales Invoice"
			},
			{
				label: wn._("Purchase Invoice"),
				description: wn._("Bills raised by Suppliers."),
				doctype:"Purchase Invoice"
			},
		]
	},
	{
		title: wn._("Masters"),
		icon: "icon-book",
		items: [
			{
				label: wn._("Chart of Accounts"),
				route: "Accounts Browser/Account",
				description: wn._("Structure of books of accounts."),
				doctype:"Account"
			},
			{
				label: wn._("Chart of Cost Centers"),
				route: "Accounts Browser/Cost Center",
				description: wn._("Structure cost centers for budgeting."),
				doctype:"Cost Center"
			},
		]
	},
	{
		title: wn._("Tools"),
		icon: "icon-wrench",
		items: [
			{
				"route":"Form/Bank Reconciliation/Bank Reconciliation",
				"label": wn._("Bank Reconciliation"),
				"description": wn._("Update bank payment dates with journals."),
				doctype: "Bank Reconciliation"
			},
			{
				"route":"Form/Payment to Invoice Matching Tool/Payment to Invoice Matching Tool",
				"label": wn._("Payment Reconciliation"),
				"description": wn._("Match non-linked Invoices and Payments."),
				doctype: "Payment to Invoice Matching Tool"
				
			},
			{
				"label": wn._("Period Closing Voucher"),
				"doctype": "Period Closing Voucher",
				description: "Close Balance Sheet and book Profit or Loss."
			},
			{
				"route":"Form/Sales and Purchase Return Tool/Sales and Purchase Return Tool",
				"label": wn._("Sales and Purchase Return Tool"),
				description: wn._("Manage sales or purchase returns"),
				"doctype": "Sales and Purchase Return Tool"
			},
			{
				"page":"voucher-import-tool",
				"label": wn._("Voucher Import Tool"),
				"description": "Import accounting entries from CSV."
			},		
		]
	},
	{
		title: wn._("Setup"),
		icon: "icon-cog",
		items: [
			{
				"label": wn._("Sales Taxes and Charges Master"),
				"doctype":"Sales Taxes and Charges Master",
				"description": wn._("Tax Template for Sales")
			},
			{
				"label": wn._("Purchase Taxes and Charges Master"),
				"doctype":"Purchase Taxes and Charges Master",
				"description": wn._("Tax Template for Purchase")
			},
			{
				"label": wn._("Point-of-Sale Setting"),
				"doctype":"POS Setting",
				"description": "User settings for Point-of-sale (POS)"
			},
			{
				"doctype":"Budget Distribution",
				"label": wn._("Budget Distribution"),
				"description": wn._("Seasonality for setting budgets.")
			},
			{
				"doctype":"Terms and Conditions",
				"label": wn._("Terms and Conditions Template"),
				description: wn._("Template of terms or contract.")
			},
			{
				"doctype":"Mode of Payment",
				"label": wn._("Mode of Payment"),
				description: wn._("e.g. Bank, Cash, Credit Card")
			},
			{
				"doctype":"C-Form",
				"label": wn._("C-Form"),
				description: "C-Form records",
				country: "India"
			}
		]
	},
	{
		title: wn._("Main Reports"),
		right: true,
		icon: "icon-table",
		items: [
			{
				"label":wn._("General Ledger"),
				page: "general-ledger"
			},
			{
				"label":wn._("Trial Balance"),
				page: "trial-balance"
			},
			{
				"page":"Financial Statements",
				"label": wn._("Financial Statements")
			},
		]
	},
	{
		title: wn._("Analytics"),
		right: true,
		icon: "icon-bar-chart",
		items: [
			{
				"label":wn._("Financial Analytics"),
				page: "financial-analytics"
			},
			{
				"label":wn._("Trend Analyzer"),
				route: "Report/Profile/Trend Analyzer",
				doctype: "Sales Invoice"
			},
		]
	},
	{
		title: wn._("Reports"),
		right: true,
		icon: "icon-list",
		items: [
			{
				"label":wn._("Delivered Items To Be Billed"),
				route: "query-report/Delivered Items To Be Billed",
				doctype: "Sales Invoice"
			},
			{
				"label":wn._("Ordered Items To Be Billed"),
				route: "query-report/Ordered Items To Be Billed",
				doctype: "Sales Invoice"
			},
		]
	}
]

pscript['onload_accounts-home'] = function(wrapper) {
	wn.views.moduleview.make(wrapper, "Accounts");
}