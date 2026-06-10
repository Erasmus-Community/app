module Api
  module V1
    class ProjectTasksController < BaseController
      before_action :set_project

      def index
        render json: @project.tasks.ordered.map { |t| serialize(t) }
      end

      def create
        task = @project.tasks.create(task_params)
        task.persisted? ? render(json: serialize(task), status: :created) : render_errors(task)
      end

      def update
        task = @project.tasks.find(params[:id])
        attrs = task_params
        if params.key?(:completed)
          attrs = attrs.merge(completed_at: params[:completed] ? Time.current : nil)
        end
        task.update!(attrs)
        render json: serialize(task)
      end

      def destroy
        @project.tasks.find(params[:id]).destroy!
        head :no_content
      end

      private

      def set_project
        @project = Project.find(params[:project_id])
        raise ActiveRecord::RecordNotFound unless @project.accessible_by?(current_organization)
      end

      def task_params
        params.fetch(:task, {}).permit(:title, :due_on, :assignee_organization_id)
      end

      def serialize(t)
        { id: t.id, title: t.title, due_on: t.due_on, completed: t.completed?,
          assignee_organization_id: t.assignee_organization_id }
      end
    end
  end
end
