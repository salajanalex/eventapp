# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

config :joken, default_signer: "secret2"

config :doggos,
  redb_host: "localhost",
  redb_port: 28015,
  redb_db: "event",
  redb_tables: [
    "users",
    "tickets",
    "events"
  ],
  app_secret_key: "secret",
  jwt_validity: 3600,
  api_host: "localhost",
  api_version: 2,
  api_prefix: "http",
  routing_keys: %{
      # System Events
      "event_add" => "tickets.add.event.doggos-events",
      "event_list" => "tickets.list.event.doggos-events"

    }

config :event_bus_helper,
        url: "guest:guest@localhost",
        exchange: "doggos",
        queue: "tickets"

# This configuration is loaded before any dependency and is restricted
# to this project. If another project depends on this project, this
# file won't be loaded nor affect the parent project. For this reason,
# if you want to provide default values for your application for
# third-party users, it should be done in your "mix.exs" file.

# You can configure your application as:
#
#     config :minimal_server, key: :value
#
# and access this configuration in your application as:
#
#     Application.get_env(:minimal_server, :key)
#
# You can also configure a third-party app:
#
#     config :logger, level: :info
#

# It is also possible to import configuration files, relative to this
# directory. For example, you can emulate configuration per environment
# by uncommenting the line below and defining dev.exs, test.exs and such.
# Configuration from the imported file will override the ones defined
# here (which is why it is important to import them last).
#
#     import_config "#{Mix.env()}.exs"
