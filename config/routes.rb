Rails.application.routes.draw do
  root "app#show"

  namespace :api do
    namespace :v1 do
      resource :session, only: %i[create destroy]
      resource :registration, only: %i[create]
      resource :me, only: %i[show], controller: "me"

      resources :organizations, only: %i[index show update] do
        collection { get :network }
      end
      resources :connections, only: %i[index create update]

      resources :projects, only: %i[index show create update] do
        resources :partnerships, only: %i[index create destroy], controller: "project_partnerships"
        resources :tasks, only: %i[index create update destroy], controller: "project_tasks"
        resources :resources, only: %i[index create destroy], controller: "project_resources"
        resources :roster_entries, only: %i[index create destroy]
        resources :vacancies, only: %i[create]
      end

      resources :vacancies, only: %i[index show update] do
        resources :interests, only: %i[index create update], controller: "vacancy_interests"
      end

      namespace :public do
        resources :vacancies, only: %i[show], param: :token
      end

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

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # React Router catch-all (must stay last)
  get "*path", to: "app#show", constraints: ->(req) { !req.path.start_with?("/api", "/assets", "/rails", "/up") }
end
