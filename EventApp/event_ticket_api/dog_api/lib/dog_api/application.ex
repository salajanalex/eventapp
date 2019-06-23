defmodule Doggos.Application do
  use Application
  import Supervisor.Spec

  def start(_type, _args) do
      :ets.new(:my_tokens, [:set, :public, :named_table])
      #{user_id, token}

      Supervisor.start_link(children(), opts())
  end
    defp children do
     [
     {Plug.Adapters.Cowboy2, scheme: :http,
     plug: Doggos.Endpoint, options: [port: 4000]},

     worker(Doggos.DB.Manager, [[
       name: Doggos.DB.Manager,
       host: Application.get_env(:doggos, :redb_host),
       port: Application.get_env(:doggos, :redb_port)
     ]]),
     worker(Doggos.Service.EventPublisher, app_id: :doggos)
     ]
    end

  defp opts do
    [
      strategy: :one_for_one,
      name: Doggos.Supervisor
    ]
  end
end
