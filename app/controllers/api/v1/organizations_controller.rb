module Api
  module V1
    class OrganizationsController < BaseController
      skip_before_action :require_approved_organization

      # GET /api/v1/organizations/:id
      # Returns the org profile with its projects and participants.
      # viewer_role is "owner" if current_user owns this org, "participant" if they have a membership, else null.
      def show
        org = Organization.find(params[:id])
        viewer_role = membership_role_for(org)

        projects = org.projects.includes(users: []).order(starts_on: :desc).map do |project|
          serialize_project(project)
        end

        render json: {
          organization: OrganizationSerializer.call(org, contact: viewer_role == "owner"),
          viewer_role: viewer_role,
          projects: projects
        }
      end

      # POST /api/v1/organizations
      # Create an organization and assign the current user as its owner.
      def create
        if current_user.organization_id.present?
          render json: { errors: ["You already belong to an organization"] }, status: :unprocessable_entity
          return
        end

        ActiveRecord::Base.transaction do
          org = Organization.create!(organization_params)
          current_user.update!(organization: org, org_role: "org_admin")
          # Also create a membership record
          Membership.create!(user: current_user, organization: org, role: "owner")
          render json: MeSerializer.call(current_user.reload), status: :created
        end
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      private

      def membership_role_for(org)
        return "owner" if current_user&.organization_id == org.id && current_user&.org_admin?

        membership = current_user&.memberships&.find_by(organization: org)
        membership&.role
      end

      def serialize_project(project)
        {
          id: project.id,
          title: project.title,
          project_type: project.project_type,
          key_action: project.key_action,
          venue_country: project.venue_country,
          starts_on: project.starts_on&.iso8601,
          ends_on: project.ends_on&.iso8601,
          description: project.description,
          participants: project.users.map do |u|
            { id: u.id, name: u.name, email: u.email,
              current_city: u.current_city, current_country: u.current_country }
          end
        }
      end

      def organization_params
        params.require(:organization)
              .permit(:name, :country, :oid, :website, :description,
                      key_actions: [], expertises: [], languages: [])
      end
    end
  end
end
