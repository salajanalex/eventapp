defmodule Doggos.Service.EventPublisher do

  use EventBusHelper

  use Timex



  require Poison



  def start_link(_), do: start



  def publish(routing_key, payload, options \\ []) do

    EventBusHelper.publish(routing_key, Poison.encode!(payload), options ++ [

      app_id: "doggos",

      content_type: "application/json",

      persistent: true

    ])

  end

end
