class OrganizationSerializer
  # contact: true reveals contact details (own org or accepted connection)
  def self.call(org, contact: false)
    base = {
      id: org.id, name: org.name, country: org.country, website: org.website,
      description: org.description, key_actions: org.key_actions,
      expertises: org.expertises, languages: org.languages, status: org.status
    }
    if contact
      base[:oid] = org.oid
      base[:members] = org.users.map { |u| { name: u.name, email: u.email } }
    end
    base
  end
end
