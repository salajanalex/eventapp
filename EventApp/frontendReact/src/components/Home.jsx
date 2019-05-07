
import React from 'react';
import { withRouter } from 'react-router';
import { Navbar, Nav, ButtonToolbar, Button } from 'react-bootstrap'
import '../design.css'


class Home extends React.Component {
  render() {


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


        <h1 className="welcomePage">Welcome to EventApp</h1>
        <h4 className="welcomePage">Get your ticket right now!</h4>

      </div>
    )
  }
}

export default withRouter(Home);