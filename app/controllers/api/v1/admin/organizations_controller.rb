module Api
  module V1
    module Admin
      class OrganizationsController < BaseController
        skip_before_action :require_approved_organization
        before_action :require_admin

        def index
          orgs = Organization.order(created_at: :desc)
          orgs = orgs.where(status: params[:status]) if params[:status].present?
          render json: orgs.map { |o| OrganizationSerializer.call(o, contact: true) }
        end

        def approve
          transition("approved")
        end

        def reject
          transition("rejected")
        end

        private

        def require_admin
          render json: { error: "Forbidden" }, status: :forbidden unless current_user&.admin?
        end

        def transition(status)
          org = Organization.find(params[:id])
          org.update!(status: status)
          # TODO: send approval/rejection email (ApplicationMailer) once SMTP is configured
          render json: OrganizationSerializer.call(org, contact: true)
        end
      end
    end
  end
end
