module Api
  module V1
    class ProjectsController < BaseController
      def index
        ids = ProjectPartnership.where(organization_id: current_organization.id).select(:project_id)
        projects = Project.where(organization_id: current_organization.id)
                          .or(Project.where(id: ids))
        render json: projects.order(created_at: :desc).map { |p| serialize(p) }
      end

      def show
        project = find_accessible_project
        render json: serialize(project, detailed: true)
      end

      def create
        project = current_organization.projects.create(project_params)
        if project.persisted?
          render json: serialize(project), status: :created
        else
          render_errors(project)
        end
      end

      def update
        project = current_organization.projects.find(params[:id]) # only lead org edits
        if project.update(project_params)
          render json: serialize(project)
        else
          render_errors(project)
        end
      end

      private

      def find_accessible_project
        project = Project.find(params[:id])
        raise ActiveRecord::RecordNotFound unless project.accessible_by?(current_organization)

        project
      end

      def project_params
        params.require(:project)
              .permit(:title, :key_action, :project_type, :venue_country,
                      :starts_on, :ends_on, :description, :status)
      end

      def serialize(p, detailed: false)
        base = {
          id: p.id, title: p.title, key_action: p.key_action, project_type: p.project_type,
          venue_country: p.venue_country, starts_on: p.starts_on, ends_on: p.ends_on,
          description: p.description, status: p.status,
          lead: { id: p.organization_id, name: p.organization.name },
          is_lead: p.organization_id == current_organization.id
        }
        if detailed
          base[:partners] = p.partner_organizations.map { |o| { id: o.id, name: o.name, country: o.country } }
        end
        base
      end
    end
  end
end
