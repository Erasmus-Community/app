module Api
  module V1
    class RosterEntriesController < BaseController
      before_action :set_project

      def index
        render json: @project.roster_entries.includes(:organization).order(:full_name).map { |e| serialize(e) }
      end

      def create
        entry = @project.roster_entries.create(entry_params.merge(organization: current_organization))
        entry.persisted? ? render(json: serialize(entry), status: :created) : render_errors(entry)
      end

      def destroy
        @project.roster_entries.where(organization: current_organization).find(params[:id]).destroy!
        head :no_content
      end

      private

      def set_project
        @project = Project.find(params[:project_id])
        raise ActiveRecord::RecordNotFound unless @project.accessible_by?(current_organization)
      end

      def entry_params
        params.require(:roster_entry).permit(:full_name, :email, :notes)
      end

      def serialize(e)
        { id: e.id, full_name: e.full_name, email: e.email, notes: e.notes,
          sending_org: e.organization.name, mine: e.organization_id == current_organization.id }
      end
    end
  end
end
