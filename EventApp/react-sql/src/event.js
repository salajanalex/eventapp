// npm start -> frontend
import React ,{Component} from 'react'
import ReactTable from "react-table"
import './style.css'
import 'react-table/react-table.css'

import {Navbar,Nav,ButtonToolbar,Button} from 'react-bootstrap'






class event extends Component{


    state={
        

    
      events:[],
      event:{
        idevent: '',
        name: '',
        description: '',
        idvenue: '',
        idcategory: '',
      }
    }
    

    componentDidMount(){
   
    this.getEvents();
    }

   

  

  getEvents  = _ => {
    fetch('http://localhost:4000/events',)
    .then(response => response.json())
    .then(response => this.setState({events: response.data}))
    .catch(err => console.error(err) )
}

   

  addEvent = _ => {
    const event = this.state.event;
    fetch(`http://localhost:4000/events/add?idevent=${event.idevent}&name=${event.name}&description=${event.description}&idvenue=${event.idvenue}&idcategory=${event.idcategory}`)
    .then(this.getEvents)
    .catch(err => console.error(err))



}

    

    
    renderUser = ({iduser,usertype,firstname,lastname,email,password}) => <div key={iduser}>{usertype}>{firstname}>{lastname}>{email}>{password}</div>
    
    renderTickets = ({idticket,type,price,idevent,iduser}) => <div key={idticket}>{type}>{price}>{idevent}>{iduser}</div>

    renderEvents = ({idevent,name,description,idvenue,idcategory}) => <div key={idevent}>{name}>{description}>{idvenue}>{idcategory}</div>

    render(){
        
        const eventdata = this.state.events
    

        const eventcolums = [{
            Header: 'EventName',
            accessor: 'name' // String-based value accessors!
          }, {
            Header: 'Description',
            accessor: 'description',
           
          }, {
            Header:'IDVenue',
            accessor: 'idvenue'
          },
          {
            Header:'IDCategory',
            accessor: 'idcategory'
          },
        
       ]

  // 
    

        
        const {events,event} = this.state

      


        return(
         
            <div className="event">

<Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">EventApp</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#">Home</Nav.Link>
      <Nav.Link href="http://localhost:3000/events">Events</Nav.Link>
      <Nav.Link href="#">Tickets</Nav.Link>
      <Nav.Link href="#">Users</Nav.Link>
      
    </Nav>
    </Navbar>


            <ReactTable
            data={eventdata}
            columns={eventcolums}
            />


           


            <div>
                <input value ={event.idevent} placeholder="idEvent" onChange={e => this.setState({ event: { ...event, idevent: e.target.value }})} />
                <input value ={event.name} placeholder="name" onChange={e => this.setState({ event: { ...event, name: e.target.value }})} />
                <input value ={event.description} placeholder="description" onChange={e => this.setState({ event: { ...event, description: e.target.value }})} />
                <input value ={event.idvenue} placeholder="idVenue" onChange={e => this.setState({ event: { ...event, idvenue: e.target.value }})} />
                <input value ={event.idcategory} placeholder="idCategory" onChange={e => this.setState({ event: { ...event, idcategory: e.target.value }})} />
                <ButtonToolbar>
                <Button variant="primary" onClick = {this.addEvent}>Add event</Button>
                <Button variant="danger">Delete event </Button>
                <Button variant="warning">Update event</Button>
                </ButtonToolbar>
                


            </div>

            

            </div>

           
        )
    }
}

export default event