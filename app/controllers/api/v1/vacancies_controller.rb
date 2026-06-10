module Api
  module V1
    class VacanciesController < BaseController
      # Shared board: open vacancies across the platform, urgent first
      def index
        vacancies = Vacancy.open_board.includes(project: :organization)
        vacancies = vacancies.where(urgent: true) if params[:urgent] == "true"
        if params[:country].present?
          vacancies = vacancies.where("countries = '{}' OR ? = ANY(countries)", params[:country])
        end
        render json: vacancies.limit(100).map { |v| serialize(v) }
      end

      def show
        vacancy = Vacancy.find(params[:id])
        render json: serialize(vacancy, detailed: true)
      end

      def create
        project = current_organization.projects.find(params[:project_id])
        vacancy = project.vacancies.create(vacancy_params)
        vacancy.persisted? ? render(json: serialize(vacancy), status: :created) : render_errors(vacancy)
      end

      def update
        vacancy = Vacancy.joins(:project).where(projects: { organization_id: current_organization.id })
                         .find(params[:id])
        if vacancy.update(vacancy_params)
          render json: serialize(vacancy)
        else
          render_errors(vacancy)
        end
      end

      private

      def vacancy_params
        params.require(:vacancy)
              .permit(:title, :slots, :participant_profile, :deadline, :urgent, :status, countries: [])
      end

      def serialize(v, detailed: false)
        p = v.project
        base = {
          id: v.id, title: v.title, slots: v.slots, participant_profile: v.participant_profile,
          countries: v.countries, deadline: v.deadline, urgent: v.urgent, status: v.status,
          public_token: (v.public_token if p.organization_id == current_organization.id),
          project: { id: p.id, title: p.title, venue_country: p.venue_country,
                     starts_on: p.starts_on, ends_on: p.ends_on,
                     organization: { id: p.organization.id, name: p.organization.name, country: p.organization.country } },
          mine: p.organization_id == current_organization.id
        }
        if detailed && base[:mine]
          base[:interests] = v.interests.includes(:organization).map { |i|
            { id: i.id, status: i.status, participant_count: i.participant_count, message: i.message,
              organization: { id: i.organization.id, name: i.organization.name, country: i.organization.country } }
          }
        end
        base
      end
    end
  end
end
