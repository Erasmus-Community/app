module Api
  module V1
    class ProjectsController < BaseController
      before_action :set_organization

      # GET /api/v1/organizations/:organization_id/projects
      def index
        projects = @organization.projects.includes(:users).order(starts_on: :desc)
        render json: projects.map { |p| serialize_project(p) }
      end

      # POST /api/v1/organizations/:organization_id/projects
      def create
        unless current_user.owner_of?(@organization)
          render json: { error: "Only organization owners can create projects" }, status: :forbidden
          return
        end

        project = @organization.projects.build(project_params)
        if project.save
          render json: serialize_project(project), status: :created
        else
          render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_organization
        @organization = Organization.find(params[:organization_id])
      end

      def project_params
        params.require(:project).permit(
          :title, :project_type, :key_action,
          :venue_country, :starts_on, :ends_on, :description
        )
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
    end
  end
end
