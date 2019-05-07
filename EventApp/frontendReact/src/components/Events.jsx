
import React from 'react';
import { withRouter } from 'react-router';
import { Navbar, Nav, ButtonToolbar, Button } from 'react-bootstrap'
import ReactTable from "react-table"

class Events extends React.Component {
  state = {
    events: [],
    event: {
      idevent: '',
      name: '',
      description: '',
      idvenue: '',
      idcategory: ''

    }
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents = _ => {
    fetch('http://localhost:4000/events')
      .then(response => response.json())
      .then(response => this.setState({ events: response.data }))
      .catch(err => console.error(err))
  }




  render() {

    const data = this.state.events

    const columns = [{
      Header: 'Name',
      accessor: 'name' // String-based value accessors!
    }, {
      Header: 'Description',
      accessor: 'description',

    }
    ]
    const { events, event } = this.state;



    return (

      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand onClick={() => (this.props.history.push('/'))}>EventApp</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link onClick={() => (this.props.history.push('/'))}>Home</Nav.Link>
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
        <br></br>
        <br></br>
        <ButtonToolbar>
          <Button variant="primary" onClick={this.addEvent}>Add new Event</Button>
          <Button variant="danger" onClick={this.deleteEvent}>Delete Event </Button>
          <Button variant="secondary" onClick={this.updateEvent}>Update Event </Button>
        </ButtonToolbar>
      </div>

    )
  }
}
export default withRouter(Events);