module Api
  module V1
    class ProjectResourcesController < BaseController
      before_action :set_project

      def index
        render json: @project.resources.order(created_at: :desc).map { |r| serialize(r) }
      end

      def create
        resource = @project.resources.create(resource_params.merge(organization: current_organization))
        resource.persisted? ? render(json: serialize(resource), status: :created) : render_errors(resource)
      end

      def destroy
        @project.resources.where(organization: current_organization).find(params[:id]).destroy!
        head :no_content
      end

      private

      def set_project
        @project = Project.find(params[:project_id])
        raise ActiveRecord::RecordNotFound unless @project.accessible_by?(current_organization)
      end

      def resource_params
        params.require(:resource).permit(:title, :url, :kind)
      end

      def serialize(r)
        { id: r.id, title: r.title, url: r.url, kind: r.kind, added_by: r.organization.name }
      end
    end
  end
end
