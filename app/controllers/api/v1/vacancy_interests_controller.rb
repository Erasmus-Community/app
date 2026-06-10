module Api
  module V1
    class VacancyInterestsController < BaseController
      before_action :set_vacancy

      def index
        return forbidden unless owner?

        render json: @vacancy.interests.includes(:organization).map { |i| serialize(i) }
      end

      # Another org expresses interest (sends participants)
      def create
        return render json: { error: "Vacancy is not open" }, status: :unprocessable_entity unless @vacancy.open?
        return render json: { error: "You posted this vacancy" }, status: :unprocessable_entity if owner?

        interest = @vacancy.interests.create(
          organization: current_organization,
          participant_count: params[:participant_count] || 1,
          message: params[:message]
        )
        interest.persisted? ? render(json: serialize(interest), status: :created) : render_errors(interest)
      end

      # Vacancy owner accepts/declines
      def update
        return forbidden unless owner?

        interest = @vacancy.interests.find(params[:id])
        status = params[:status]
        return render json: { error: "Invalid status" }, status: :unprocessable_entity unless %w[accepted declined].include?(status)

        interest.update!(status: status)
        render json: serialize(interest)
      end

      private

      def set_vacancy
        @vacancy = Vacancy.find(params[:vacancy_id])
      end

      def owner?
        @vacancy.project.organization_id == current_organization.id
      end

      def forbidden
        render json: { error: "Forbidden" }, status: :forbidden
      end

      def serialize(i)
        { id: i.id, status: i.status, participant_count: i.participant_count, message: i.message,
          organization: { id: i.organization.id, name: i.organization.name, country: i.organization.country } }
      end
    end
  end
end
