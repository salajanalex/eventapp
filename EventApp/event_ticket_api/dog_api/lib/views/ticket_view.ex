defmodule Doggos.Views.TicketView do
    use JSONAPI.View
  
    def fields, do: [:iduser, :event, :price, :type]
    def type, do: "ticket"
    def relationships, do: []
  end
  