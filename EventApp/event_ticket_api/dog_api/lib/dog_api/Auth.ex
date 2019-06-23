defmodule Doggos.Auth do
  use GenServer
  use Timex
  import Joken
  require Logger

  alias Comeonin.Pbkdf2
  alias Doggos.Helpers.MapHelper
  
  @app_secret_key Application.get_env(:doggos, :app_secret_key)
  @jwt_validity Application.get_env(:doggos, :jwt_validity)

  # Client API
@doc "
Starts Authentication Server.

Returns process id.
"
def start_link do
  GenServer.start_link(__MODULE__, [])
end

@doc "
Generates a hash follwing pbkdf2_sha512 standard .

Returns hash String.
"
def verify_hash(server, {password, hash}) do
  GenServer.call(server, {:verify_hash, {password, hash}})
end

@doc "
Verifies that given `password` matches stored `hash`.

Returns `true` is `password` matches.
Returns `false` otherwise.
"
def generate_hash(server, password) do
  GenServer.call(server, {:generate_hash, password})
end

@doc "
Generates a JWT representing User payload.

Returns :error if user does not exist or login credentials are not valid.
"
def issue_token(server, user) when is_map(user) do
  GenServer.call(server, {:issue_token, user})
end

@doc "
Revokes a valid JWT.

Returns :ok when JWT is revoked successfuly.
Returns :error if JWT does not valid.
"
def revoke_token(server, user) when is_map(user) do
  GenServer.call(server, {:revoke_token, user})
end

@doc "
Verifies the validity of a JWT.

Returns %Joken{} if JWT it's valid.
"
def validate_token(server, jwt) do
  GenServer.call(server, {:validate_token, jwt})
end

@doc "
Stops Auth server

Returns :ok on success.
"
def stop(server) do
  GenServer.stop(server)
end

def init(_) do
  # Initializing ETS table.
  table = case :ets.info(:auth_tokens) do
    :undefined ->
      Logger.log(:debug, "Initializing ETS table")

      :ets.new(:auth_tokens,
       [:set, :public, :named_table, read_concurrency: true])
    _ ->
      Logger.log(:debug, "ETS table already exists")

      :auth_tokens
  end

  {:ok, %{table: table}}
end

# Server API
def handle_call({:issue_token, claims}, _from, state) when is_map(claims) do
  jwt = claims |> Map.merge(%{
    iss: @issuer,
    iat: Timex.to_unix(Timex.now),
    exp: Timex.to_unix(Timex.shift(Timex.now, days: @jwt_validity))
  })
  |> Joken.token
  |> Joken.with_signer(Joken.hs256(:base64.encode(@app_secret_key)))
  |> Joken.sign
  |> Joken.get_compact

  :ets.insert(:auth_tokens, {claims.id, jwt})

  {:reply, jwt, state}
end

def handle_call({:revoke_token, user}, _from, state) when is_map(user) do
  validity = case :ets.lookup(:auth_tokens, user.id) do
    [{_, _jwt}] ->
      :ets.delete(:auth_tokens, user.id)

      :ok
    _ -> :error
  end

  {:reply, validity, state}
end

def handle_call({:validate_token, jwt_compact}, _from, state)
  when is_binary(jwt_compact) do
  # Verifying JWT signature
  jwt = jwt_compact
  |> Joken.token
  |> Joken.with_signer(Joken.hs256(:base64.encode(@app_secret_key)))
  |> Joken.verify

  cond do
    is_nil(jwt.error) ->
      jwt_claims = jwt.claims |> MapHelper.string_keys_to_atoms

      case :ets.lookup(:auth_tokens, jwt_claims.id) do
        [{_, ^jwt_compact}] ->
          cond do
            # Validating that token has not expired
            jwt_claims.exp >= Timex.to_unix(Timex.now) ->
              # Sending back only payload keys
              {:reply, {:ok, jwt_claims}, state}
            true ->
              # Removing expired token from ETS table
              :ets.delete(:auth_tokens, jwt_claims.id)

              Logger.log(:error, "Token expired: #{jwt_compact}")

              {:reply, {:error, "token has expired"}, state}
          end
        _ ->
          # A valid JWT token does not match currently stored JWT
          # in ETS table for `User`.
          Logger.log(:error, "Token mismatch: #{jwt_compact}")

          {:reply, {:error, "token is not valid"}, state}
      end
    true ->
      # JWT Signature is invalid.
      Logger.log(:error, "#{jwt.error}: #{jwt_compact}")

      {:reply, {:error, "invalid signature"}, state}
  end

end

def handle_call({:generate_hash, password}, _from, state) do
  {:reply, Pbkdf2.hashpwsalt(password), state}
end

def handle_call({:verify_hash, {password, hash}}, _from, state) do
  {:reply, Pbkdf2.checkpw(password, hash), state}
end
 
end