module Api
  module V1
    class ConnectionsController < BaseController
      def index
        connections = Connection.involving(current_organization).includes(:requester, :addressee)
        render json: connections.order(created_at: :desc).map { |c| serialize(c) }
      end

      def create
        connection = current_organization.sent_connections.create(
          addressee_id: params[:addressee_id], message: params[:message]
        )
        if connection.persisted?
          render json: serialize(connection), status: :created
        else
          render_errors(connection)
        end
      end

      # Accept/decline a request addressed to my org
      def update
        connection = current_organization.received_connections.find(params[:id])
        status = params[:status]
        return render json: { error: "Invalid status" }, status: :unprocessable_entity unless %w[accepted declined].include?(status)

        connection.update!(status: status)
        render json: serialize(connection)
      end

      private

      def serialize(c)
        other = c.other_party(current_organization)
        {
          id: c.id, status: c.status, message: c.message,
          requested_by_me: c.requester_id == current_organization.id,
          organization: OrganizationSerializer.call(other, contact: c.accepted?)
        }
      end
    end
  end
end
