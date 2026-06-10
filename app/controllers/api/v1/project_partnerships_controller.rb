module Api
  module V1
    class ProjectPartnershipsController < BaseController
      before_action :set_project

      def index
        render json: @project.project_partnerships.includes(:organization).map { |pp|
          { id: pp.id, organization: { id: pp.organization.id, name: pp.organization.name } }
        }
      end

      # Lead org invites a connected org as partner
      def create
        return forbidden unless @project.organization_id == current_organization.id

        org = Organization.approved.find(params[:organization_id])
        unless current_organization.connected_to?(org)
          return render json: { error: "You can only add organizations from your network" },
                        status: :unprocessable_entity
        end

        pp = @project.project_partnerships.create(organization: org)
        pp.persisted? ? render(json: { id: pp.id }, status: :created) : render_errors(pp)
      end

      def destroy
        return forbidden unless @project.organization_id == current_organization.id

        @project.project_partnerships.find(params[:id]).destroy!
        head :no_content
      end

      private

      def set_project
        @project = Project.find(params[:project_id])
        raise ActiveRecord::RecordNotFound unless @project.accessible_by?(current_organization)
      end

      def forbidden
        render json: { error: "Only the lead organization can manage partners" }, status: :forbidden
      end
    end
  end
end
