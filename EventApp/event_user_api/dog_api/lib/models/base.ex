defmodule Doggos.Models.Base do
  alias Doggos.DB.Manager

  use Timex

  defmodule Doggos.Models.Validator do
    @callback is_valid() :: boolean
  end

  defmacro __using__(_) do
    quote do
      @doc "
      Retrieves a document from the database by `id` and converts it to the
      `Struct` using this macro.

      Returns :error if `id` does not match any document.
      "
      def get(id) do
        case Manager.get(@db_name, @db_table, id) do
          {:ok, doc} ->
            {:ok, doc |> merge_to_struct}
          _ ->
            :error
        end
      end

      @doc "
      Saves a document. An `id` key will be added if :id key is misisng.
      `created_at` key will be set to current time if the object is not
      `updated_at` key will be set to current time

      Returns :error if document cannot be saved.
      "
      def save(document) when is_map(document) do
        # Removes :id key if its value its `nil`. This will allow
        # the datastore is responsible for generating UUIDs.
        document = case {document.created_at, document.updated_at}  do
          {nil, nil} ->
            document
            |> Map.put(:created_at, Timex.to_unix(Timex.now))
            |> Map.put(:updated_at, Timex.to_unix(Timex.now))
          {_, _} ->
            document
            |> Map.put(:updated_at, Timex.to_unix(Timex.now))
        end
        |> Map.from_struct
        |> eval_id

        # Saving document
        case Manager.insert(@db_name, @db_table, document) do
          {:ok, saved_doc} ->
            {:ok, saved_doc |> merge_to_struct}
          _ ->
            :error
        end
      end

      @doc "
      Finds documents that match given `filters`.

      Returns :error if document cannot be saved.
      "
      def find(filters) when is_map(filters) do
        case Manager.filter(@db_name, @db_table, filters) do
          {:ok, saved_docs} ->
            {:ok, saved_docs |> Enum.map(&(merge_to_struct(&1)))}
          _ ->
            :error
        end
      end

      @doc "
      Finds documents that match given `filters`.

      Returns :error if document cannot be saved.
      "
      def match(field, query) do
        case Manager.match(@db_name, @db_table, field, query) do
          {:ok, saved_docs} ->
            {:ok, saved_docs |> Enum.map(&(merge_to_struct(&1)))}
          _ ->
            :error
        end
      end

      @doc "
      Deletes a document by `id`.

      Returns :error if document cannot be saved.
      "
      def delete(id) do
        Manager.delete(@db_name, @db_table, %{id: id})
      end

      defp eval_id(document) when is_map(document) do
        case document.id do
          nil ->
            document |> Map.delete(:id)
          _ ->
            document
        end
      end

      defp merge_to_struct(document) when is_map(document) do
        # Merges Map to __struct__
        __struct__ |> Map.merge(document)
      end
    end
  end
end
