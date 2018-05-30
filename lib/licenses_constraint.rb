class LicensesConstraint
	def matches?(request)
		SiteSetting.procourse_static_pages_licensed
	end
end