class LicensesConstraint
	def matches?(request)
		SiteSetting.pc_static_pages_licensed
	end
end