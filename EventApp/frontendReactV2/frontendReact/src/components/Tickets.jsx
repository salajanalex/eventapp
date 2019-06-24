
import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from "react-table"
import { Navbar, Nav, ButtonToolbar, Button } from 'react-bootstrap'

class Tickets extends React.Component {

  state = {
    tickets: [],
    ticket: {
      idticket: '',
      type: '',
      price: '',
      idevent: '',
      iduser: ''
    }
  }

  componentDidMount() {
    this.getTickets();
  }

  getTickets = _ => {
    fetch('http://localhost:4000/tickets')
      .then(response => response.json())
      .then(response => this.setState({ tickets: response.data }))
      .catch(err => console.error(err))
  }




  render() {
    const data = this.state.tickets

    const columns = [{
      Header: 'Type',
      accessor: 'type' // String-based value accessors!
    }, {
      Header: 'Price',
      accessor: 'price',

    },{
      Header: 'Editable',
      accessor: 'editable',
    }
    ]
    const { tickets, ticket } = this.state;


    return (

      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand onClick={() => (this.props.history.push('/'))}>EventApp</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link onClick={() => (this.props.history.push('/home'))}>Home</Nav.Link>
            <Nav.Link onClick={() => (this.props.history.push('/events'))}>Events</Nav.Link>
            <Nav.Link onClick={() => (this.props.history.push('/tickets'))}>Tickets</Nav.Link>
            <Nav.Link onClick={() => (this.props.history.push('/users'))}>Users</Nav.Link>

          </Nav>
        </Navbar>

        <ReactTable
          defaultPageSize={13}
          minRows={13}
          data={data}
          columns={columns}
        />

        <Button variant="primary">Buy a ticket</Button>
        
      </div>

    )
  }
}
export default withRouter(Tickets);