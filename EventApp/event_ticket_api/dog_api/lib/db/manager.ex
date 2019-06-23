defmodule Doggos.DB.Manager do
  use RethinkDB.Connection

  require Logger

  require RethinkDB.Lambda
  import RethinkDB.Lambda

  alias RethinkDB.Query
  alias Doggos.Helpers.MapHelper

  def init_db(db_name, tables) do
    dbs = Query.db_list
    |> run
    |> Map.get(:data)

    unless dbs |> Enum.member?(db_name) do
      # Creating database
      Query.db_create(db_name)
      |> run

      Logger.log(:info, "Created Database #{db_name}")
    end

    # Creating tables
    tables
    |> MapSet.new
    |> MapSet.difference(
      Query.table_list
      |> run(db: db_name)
      |> Map.get(:data) # Getting existing tables
      |> MapSet.new
    ) # Missing tables
    |> Enum.map(&(Query.table_create(&1) |> run(db: db_name)))
  end

  @doc "
  Inserts a new document.

  Returns {:ok,
  "
  def insert(db_name, table_name, document) when is_map(document) do
    resp = Query.table(table_name)
    |> Query.insert(document, conflict: "update")
    |> run(db: db_name)

    if resp.data["errors"] > 0 do
      err_msg = resp.data["first_error"] ||
        "Error creating document #{Poison.encode!(document)}"

      Logger.log(:error, err_msg)

      {:error, err_msg}
    else
      new_document = case resp.data |> Map.has_key?("generated_keys") do
        true -> document |> Map.put(:id,
         resp.data["generated_keys"] |> List.first)
        _ -> document
      end

      {:ok, new_document |> MapHelper.string_keys_to_atoms}
    end
  end

  @doc "
  Deletes a document that match `filters` (Map).

  Returns :ok on success.
  Returns :error if document does not exists.
  "
  def delete(db_name, table_name, predicate) do
    res = Query.table(table_name)
    |> Query.filter(predicate)
    |> Query.delete
    |> run(db: db_name)

    if res.data["deleted"] > 0 do
      :ok
    else
      :error
    end
  end

  @doc "
  filter documents that match `filters` (Map).

  Returns {:ok, data :: List}
  "
  def filter(db_name, table_name, predicate) do
    res = Query.table(table_name)
    |>Query.filter(predicate)
    |> run(db: db_name)

    unless is_list(res.data) do
      {:ok, []}
    else
      {:ok, res.data |> Enum.map(&(MapHelper.string_keys_to_atoms(&1)))}
    end
  end

  @doc "
  filter documents that match `filters` (Map).

  Returns {:ok, data :: List}
  "
  def match(db_name, table_name, field, query) do
    res = Query.table(table_name)
    |> Query.filter(lambda fn (doc) -> Query.match(doc[field],query) end)
    |> run(db: db_name)

    unless is_list(res.data) do
      {:ok, []}
    else
      {:ok, res.data |> Enum.map(&(MapHelper.string_keys_to_atoms(&1)))}
    end
  end

  @doc "
  Retrieves document that matches `id` (Map).

  Returns {:ok, Stream}
  "
  def get(db_name, table_name, id) do
    res = Query.table(table_name)
    |> Query.get(id)
    |> run(db: db_name)

    if is_nil(res.data) do
      :error
    else
      {:ok, res.data |> MapHelper.string_keys_to_atoms}
    end
  end

end
