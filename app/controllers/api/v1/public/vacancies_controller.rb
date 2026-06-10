module Api
  module V1
    module Public
      # Unauthenticated read of a single vacancy via shareable token
      class VacanciesController < ActionController::Base
        protect_from_forgery with: :null_session

        def show
          vacancy = Vacancy.includes(project: :organization).find_by!(public_token: params[:token])
          p = vacancy.project
          render json: {
            title: vacancy.title, slots: vacancy.slots, urgent: vacancy.urgent,
            participant_profile: vacancy.participant_profile, deadline: vacancy.deadline,
            status: vacancy.status, countries: vacancy.countries,
            project: { title: p.title, venue_country: p.venue_country,
                       starts_on: p.starts_on, ends_on: p.ends_on,
                       organization_name: p.organization.name }
          }
        rescue ActiveRecord::RecordNotFound
          render json: { error: "Not found" }, status: :not_found
        end
      end
    end
  end
end
