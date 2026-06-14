module Api
  module V1
    class OrganizationsController < BaseController
      skip_before_action :require_approved_organization

      # Create an organization and assign the current user as its org_admin.
      def create
        if current_user.organization_id.present?
          render json: { errors: ["You already belong to an organization"] }, status: :unprocessable_entity
          return
        end

        ActiveRecord::Base.transaction do
          org = Organization.create!(organization_params)
          current_user.update!(organization: org, org_role: "org_admin")
          render json: MeSerializer.call(current_user.reload), status: :created
        end
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      private

      def organization_params
        params.require(:organization)
              .permit(:name, :country, :oid, :website, :description,
                      key_actions: [], expertises: [], languages: [])
      end
    end
  end
end
