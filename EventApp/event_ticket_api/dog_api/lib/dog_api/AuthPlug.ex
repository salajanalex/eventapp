defmodule Doggos.AuthPlug do
  import Plug.Conn

  require Logger
  

  def init(opts), do: opts

  def call(conn, _opts) do
    #doar exemplu!
    #https://devhints.io/phoenix-conn
    cond do
      conn.private |> Map.get(:jwt_skip, false) ->
        # Skipping authentication
        conn
      true ->
        {:ok, service} = Doggos.Auth.start_link

        conn = conn |> assign(:auth_service, service)
        
        jwt_compact = conn
                |> get_req_header("authorization")
                |> List.first()
                |> String.split(" ")
                |> List.last()
        
        case Doggos.Auth.validate_token(service, jwt_compact) do
          {:ok, _} -> conn
          {:error, _} -> 
            Doggos.Auth.stop(service)
            conn |> forbidden
        end
    end
  end

  defp forbidden(conn) do
    send_resp(conn, 401, "Unauthorized!") |> halt
  end
end
