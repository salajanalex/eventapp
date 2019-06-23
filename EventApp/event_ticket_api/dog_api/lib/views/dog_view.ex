defmodule Doggos.Views.DogView do
  use JSONAPI.View

  def fields, do: [:iduser, :firstname, :lastname, :email, :password, :usertype, :updated_at, :created_at]
  def type, do: "user"
  def relationships, do: []
end
