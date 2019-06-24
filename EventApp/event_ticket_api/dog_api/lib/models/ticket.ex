defmodule Doggos.Models.Ticket do
    @db_name Application.get_env(:doggos, :redb_db)
    @db_table "tickets"
  
    use Doggos.Models.Base
  
    defstruct [
      :id,
      :iduser,
      :event,
      :price,
      :type,
      :updated_at,
      :created_at
    ]
  end
  