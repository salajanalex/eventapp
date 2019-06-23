defmodule Doggos.Router do
  use Plug.Router
  use Timex
  alias Doggos.Models.User
  alias Doggos.Service.EventPublisher

  @skip_token_verification %{jwt_skip: true}
  @skip_token_verification_view %{view: UserView, jwt_skip: true}
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


  get "/" , private: %{view: UserView} do
    params = Map.get(conn.params, "filter", %{})
    email = Map.get(params, "q", "")

    {:ok, users} =  User.match("email", email)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Poison.encode!(users))
  end

  get "/:id", private: %{view: UserView}  do
    case User.get(id) do
      {:ok, user} ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(200, Poison.encode!(user))
      :error ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(200, Poison.encode!(%{"error" => "'user' not found"}))
    end
 end

  post "/" do
    {email, usertype, password, lastname, iduser, firstname} = {
      Map.get(conn.params, "email", nil),
      Map.get(conn.params, "usertype", nil),
      Map.get(conn.params, "password", nil),
      Map.get(conn.params, "lastname", nil),
      Map.get(conn.params, "iduser", nil),
      Map.get(conn.params, "firstname", nil)
    }

    cond do
      is_nil(email) ->
        conn
        |> put_status(400)
        |> assign(:jsonapi, %{"error" => "'email' field must be provided"})
      is_nil(password) ->
        conn
        |> put_status(400)
        |> assign(:jsonapi, %{"error" => "'password' field must be provided"})
      true ->
        case %User{
          email: email,
          usertype: usertype,
          password: password,
          lastname: lastname,
          iduser: iduser,
          firstname: firstname
        } |> User.save do
          {:ok, new_user} ->

            EventPublisher.publish(
             @routing_keys |> Map.get("user_add"),
             new_user |> Map.take([:id, :email, :usertype, :password, :lastname, :iduser, :firstname]))

            conn
            |> put_resp_content_type("application/json")
            |> send_resp(201, Poison.encode!(%{:data => new_user}))
          :error ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(500, Poison.encode!(%{"error" => "An unexpected error happened"}))

        end
    end
  end

  put "/:id" do
    {email, usertype, password, lastname, firstname} = {
      Map.get(conn.params, "email", nil),
      Map.get(conn.params, "usertype", nil),
      Map.get(conn.params, "password", nil),
      Map.get(conn.params, "lastname", nil),
      Map.get(conn.params, "firstname", nil)
    }

    cond do
      is_nil(email) ->
        conn
        |> put_status(400)
        |> assign(:jsonapi, %{"error" => "'email' field must be provided"})
      is_nil(password) ->
        conn
        |> put_status(400)
        |> assign(:jsonapi, %{"error" => "'password' field must be provided"})
      true ->
        case User.get(id) do
          {:ok, user} ->
            user.put(:email, email)
            user.put(:usertype, usertype)
            user.put(:password, password)
            user.put(:lastname, lastname)
            user.put(:firstname, firstname)
            case user |> User.save do
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
            |> send_resp(400, Poison.encode!(%{"error" => "'user' not found"}))
        end
    end
  end

  delete "/:id" do
      case User.delete(id) do
          :ok ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(201, Poison.encode!(%{:message => "user deleted"}))
          :error ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(500, Poison.encode!(%{"error" => "An unexpected error happened"}))
      end
  end
end
