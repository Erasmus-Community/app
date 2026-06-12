Rails.application.routes.draw do
  root "app#show"

  namespace :api do
    namespace :v1 do
      resource :session, only: %i[create destroy]
      resource :registration, only: %i[create]
      resource :me, only: %i[show], controller: "me" do
        patch :update_location
      end

      resources :alumni_map, only: %i[index]

      namespace :admin do
        resources :organizations, only: %i[index] do
          member do
            patch :approve
            patch :reject
          end
        end
      end
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # React Router catch-all (must stay last)
  get "*path", to: "app#show", constraints: ->(req) { !req.path.start_with?("/api", "/assets", "/rails", "/up") }
end
