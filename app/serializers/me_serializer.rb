class MeSerializer
  def self.call(user)
    org = user.organization
    {
      user: { id: user.id, name: user.name, email: user.email,
              org_role: user.org_role, admin: user.admin,
              current_city: user.current_city, current_country: user.current_country,
              latitude: user.latitude&.to_f, longitude: user.longitude&.to_f,
              map_visibility: user.map_visibility, bio: user.bio },
      organization: org ? OrganizationSerializer.call(org, contact: true) : nil
    }
  end
end
