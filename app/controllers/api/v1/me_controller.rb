module Api
  module V1
    class MeController < BaseController
      skip_before_action :require_approved_organization

      def show
        render json: MeSerializer.call(current_user)
      end
    end
  end
end
