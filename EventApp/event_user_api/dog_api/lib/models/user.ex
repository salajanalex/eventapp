defmodule Doggos.Models.User do
    @db_name Application.get_env(:doggos, :redb_db)
    @db_table "users"
  
    use Doggos.Models.Base
  
    defstruct [
      :id,
      :iduser,
      :firstname,
      :lastname,
      :email,
      :password,
      :usertype,
      :updated_at,
      :created_at
    ]
  end
  