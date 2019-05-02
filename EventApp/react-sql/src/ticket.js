// npm start -> frontend
import React ,{Component} from 'react'
import ReactTable from "react-table"
import './style.css'
import 'react-table/react-table.css'

import {Navbar,Nav,ButtonToolbar,Button} from 'react-bootstrap'






class ticket extends Component{


    state={
       
      tickets:[],
      ticket:{
        idticket: '',
        type: '',
        price: '',
        idevent: '',
        iduser: '',
      },


    
      
    }
    

    componentDidMount(){
    
    this.getTickets();
  
    }

   
    getTickets  = _ => {
      fetch('http://localhost:4000/tickets',)
      .then(response => response.json())
      .then(response => this.setState({tickets: response.data}))
      .catch(err => console.error(err) )
  }

 

   

    addTicket = _ => {
      const ticket = this.state.ticket;
      fetch(`http://localhost:4000/tickets/add?idticket=${ticket.idticket}&type=${ticket.type}&price=${ticket.price}&idevent=${ticket.idevent}&iduser=${ticket.iduser}`)
      .then(this.getTickets)
      .catch(err => console.error(err))



  }

  

    

    
   
    renderTickets = ({idticket,type,price,idevent,iduser}) => <div key={idticket}>{type}>{price}>{idevent}>{iduser}</div>

    render(){
      
        const ticketdata = this.state.tickets
       
    


       const ticketcolumns = [{
        Header: 'TicketType',
        accessor: 'type' // String-based value accessors!
      }, {
        Header: 'Price',
        accessor: 'price',
       
      }, {
        Header:'IDEvent',
        accessor: 'idevent'
      },
      {
        Header:'IDUser',
        accessor: 'iduser'
      },
      
   ]
    

       
        const{tickets,ticket} = this.state;

      


        return(
         
            <div className="ticket">

<Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">EventApp</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#">Home</Nav.Link>
      <Nav.Link href="#">Events</Nav.Link>
      <Nav.Link href="http://localhost:3000/tickets">Tickets</Nav.Link>
      <Nav.Link href="#">Users</Nav.Link>
      
    </Nav>
    </Navbar>


         

            <ReactTable
            data={ticketdata}
            columns={ticketcolumns}
            />

            



          
            tickets.map(this.renderTickets)

           


            <div>
                <input value ={ticket.idticket} placeholder="idTicket" onChange={e => this.setState({ ticket: { ...ticket, idticket: e.target.value }})} />
                <input value ={ticket.type} placeholder="type" onChange={e => this.setState({ ticket: { ...ticket, type: e.target.value }})} />
                <input value ={ticket.price} placeholder="price" onChange={e => this.setState({ ticket: { ...ticket, price: e.target.value }})} />
                <input value ={ticket.idevent} placeholder="idEvent" onChange={e => this.setState({ ticket: { ...ticket, idevent: e.target.value }})} />
                <input value ={ticket.iduser} placeholder="idUser" onChange={e => this.setState({ ticket: { ...ticket, iduser: e.target.value }})} />
                <ButtonToolbar>
                <Button variant="primary" onClick = {this.addTicket}>Add ticket</Button>
                <Button variant="danger">Delete ticket </Button>
                <Button variant="warning">Update ticket</Button>
                </ButtonToolbar>
                


            </div>

            

            </div>

           
        )
    }
}

export default ticket