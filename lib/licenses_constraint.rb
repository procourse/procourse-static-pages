class LicensesConstraint
	def matches?(request)
		SiteSetting.dl_static_pages_licensed
	end
end