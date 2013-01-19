// ERPNext: Copyright 2013 Web Notes Technologies Pvt Ltd
// GNU General Public License. See "license.txt"

wn.module_page["Manufacturing"] = [
	{
		title: wn._("Documents"),
		icon: "icon-copy",
		items: [
			{
				label: wn._("Production Order"),
				description: wn._("Orders released for production."),
				doctype:"Production Order"
			},
		]
	},
	{
		title: wn._("Production Planning (MRP)"),
		icon: "icon-wrench",
		items: [
			{
				"route":"Form/Production Planning Tool/Production Planning Tool",
				"label":wn._("Production Planning Tool"),
				"description":wn._("Generate Purchase Requests (MRP) and Production Orders."),
				doctype: "Production Planning Tool"
			},
		]
	},
	{
		title: wn._("Masters"),
		icon: "icon-book",
		items: [
			{
				label: wn._("Bill of Materials"),
				description: wn._("Bill of Materials (BOM)"),
				doctype:"BOM"
			},
			{
				label: wn._("Item"),
				description: wn._("All Products or Services."),
				doctype:"Item"
			},
			{
				label: wn._("Workstation"),
				description: wn._("Where manufacturing operations are carried out."),
				doctype:"Workstation"
			},
		]
	},
	{
		title: wn._("Utility"),
		icon: "icon-wrench",
		items: [
			{
				"route":"Form/BOM Replace Tool/BOM Replace Tool",
				"label":wn._("BOM Replace Tool"),
				"description":wn._("Replace Item / BOM in all BOMs"),
				doctype: "BOM Replace Tool"
			},
		]
	},
]

pscript['onload_manufacturing-home'] = function(wrapper) {
	wn.views.moduleview.make(wrapper, "Manufacturing");
}