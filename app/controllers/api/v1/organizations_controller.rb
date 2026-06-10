module Api
  module V1
    class OrganizationsController < BaseController
      # Partner directory
      def index
        orgs = Organization.approved.where.not(id: current_organization.id)
        orgs = orgs.where(country: params[:country]) if params[:country].present?
        orgs = orgs.where("? = ANY(key_actions)", params[:key_action]) if params[:key_action].present?
        orgs = orgs.where("? = ANY(expertises)", params[:expertise]) if params[:expertise].present?
        if params[:q].present?
          orgs = orgs.where("name ILIKE :q OR description ILIKE :q", q: "%#{params[:q]}%")
        end

        connected = current_organization.network_ids
        render json: orgs.order(:name).limit(100).map { |o|
          OrganizationSerializer.call(o, contact: connected.include?(o.id))
            .merge(connection: connection_summary(o))
        }
      end

      def show
        org = Organization.approved.find(params[:id])
        contact = org.id == current_organization.id || current_organization.connected_to?(org)
        render json: OrganizationSerializer.call(org, contact: contact).merge(connection: connection_summary(org))
      end

      # Own org profile update (org_admin only)
      def update
        return render json: { error: "Forbidden" }, status: :forbidden unless current_user.org_admin?

        org = current_organization
        if org.update(org_params)
          render json: OrganizationSerializer.call(org, contact: true)
        else
          render_errors(org)
        end
      end

      # Accepted connections ("my network")
      def network
        orgs = Organization.where(id: current_organization.network_ids)
        render json: orgs.order(:name).map { |o| OrganizationSerializer.call(o, contact: true) }
      end

      private

      def connection_summary(org)
        c = current_organization.connection_with(org)
        return nil unless c

        { id: c.id, status: c.status, requested_by_me: c.requester_id == current_organization.id }
      end

      def org_params
        params.require(:organization)
              .permit(:name, :country, :oid, :website, :description,
                      key_actions: [], expertises: [], languages: [])
      end
    end
  end
end
