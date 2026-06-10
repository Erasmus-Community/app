class MeSerializer
  def self.call(user)
    org = user.organization
    {
      user: { id: user.id, name: user.name, email: user.email,
              org_role: user.org_role, admin: user.admin },
      organization: OrganizationSerializer.call(org, contact: true)
    }
  end
end
