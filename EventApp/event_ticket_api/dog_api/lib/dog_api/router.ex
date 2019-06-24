defmodule Doggos.Router do
  use Plug.Router
  use Timex
  alias Doggos.Models.Ticket
  alias Doggos.Service.EventPublisher

  @skip_token_verification %{jwt_skip: true}
  @skip_token_verification_view %{view: TicketView, jwt_skip: true}
  @auth_url Application.get_env(:doggos, :auth_url)
  @api_port Application.get_env(:doggos, :port)
  @db_table Application.get_env(:doggos, :redb_db)
  @db_name Application.get_env(:doggos, :redb_db)
  @routing_keys Application.get_env(:doggos, :routing_keys)

  #use Doggos.Auth
  require Logger

  plug(Plug.Logger, log: :debug)

  plug(:match)
  plug Doggos.AuthPlug
  plug(:dispatch)


  get "/" , private: %{view: TicketView} do
    params = Map.get(conn.params, "filter", %{})
    type = Map.get(params, "q", "")

    {:ok, tickets} =  Ticket.match("type", type)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(tickets))
  end

  get "/:id", private: %{view: TicketView}  do
    case Ticket.get(id) do
      {:ok, ticket} ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(200, Poison.encode!(ticket))
      :error ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(200, Poison.encode!(%{"error" => "'ticket' not found"}))
    end
 end

  post "/" do
    {type, price, iduser, event} = {
      Map.get(conn.params, "type", nil),
      Map.get(conn.params, "price", nil),
      Map.get(conn.params, "iduser", nil),
      Map.get(conn.params, "event", nil)
    }

    cond do
      is_nil(event) ->
        conn
        |> put_status(400)
        |> assign(:jsonapi, %{"error" => "'email' field must be provided"})
      is_nil(price) ->
        conn
        |> put_status(400)
        |> assign(:jsonapi, %{"error" => "'password' field must be provided"})
      true ->
        case %Ticket{
          type: type,
          price: price,
          iduser: iduser,
          event: event
        } |> Ticket.save do
          {:ok, new_ticket} ->

            EventPublisher.publish(
             @routing_keys |> Map.get("user_add"),
             new_ticket |> Map.take([:id, :type, :price, :iduser, :event]))

            conn
            |> put_resp_content_type("application/json")
            |> send_resp(201, Poison.encode!(%{:data => new_ticket}))
          :error ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(500, Poison.encode!(%{"error" => "An unexpected error happened"}))

        end
    end
  end

  put "/:id" do
    {type, price, iduser, id, event} = {
      Map.get(conn.params, "type", nil),
      Map.get(conn.params, "price", nil),
      Map.get(conn.params, "iduser", nil),
      Map.get(conn.params, "id", nil),
      Map.get(conn.params, "event", nil)
    }

    cond do
      # is_nil(event) ->
      #   conn
      #   |> put_status(400)
      #   |> assign(:jsonapi, %{"error" => "'event' field must be provided"})
      true ->
        case Ticket.get(id) do
          {:ok, ticket} ->
            ticket.put(:type, type)
            ticket.put(:price, price)
            ticket.put(:iduser, iduser)
            ticket.put(:id, id)
            ticket.put(:event, event)
            case ticket |> Ticket.save do
              {:ok} ->
                conn
                |> put_resp_content_type("application/json")
                |> send_resp(201, Poison.encode!())
                :error ->
                  conn
                  |> put_resp_content_type("application/json")
                  |> send_resp(500, Poison.encode!(%{"error" => "error at update"}))
              end
          :error ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(400, Poison.encode!(%{"error" => "'ticket' not found"}))
        end
    end
  end

  delete "/:id" do
      case Ticket.delete(id) do
          :ok ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(201, Poison.encode!(%{:message => "ticket deleted"}))
          :error ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(500, Poison.encode!(%{"error" => "An unexpected error happened"}))
      end
  end
end
