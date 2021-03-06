
import React from 'react';
import { withRouter } from 'react-router';
import ReactTable from "react-table"
import 'react-table/react-table.css'
import { Navbar, Nav, ButtonToolbar, Button } from 'react-bootstrap'

class Users extends React.Component {


  state = {
    users: [],
    user: {
      iduser: '',
      usertype: '',
      firstname: '',
      lastname: '',
      email: '',
      password: ''

    }
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = _ => {
    fetch('http://localhost:4000/users')
      .then(response => response.json())
      .then(response => this.setState({ users: response.data }))
      .catch(err => console.error(err))
  }

  addUser = _ => {
    const user = this.state.user;
    fetch(`http://localhost:4000/users/add?iduser=${user.iduser}&usertype=${user.usertype}&firstname=${user.firstname}&lastname=${user.lastname}&email=${user.email}&password=${user.password}`)
      .then(this.getUsers)
      .catch(err => console.error(err))
  }

  deleteUser = _ => {
    const user = this.state.user;
    fetch(`http://localhost:4000/users/delete?email=${user.email}`)
      .then(this.getUsers, alert("User Deleted"))
      .catch(err => console.error(err))
  }

  updateUser = _ => {
    const user = this.state.user;
    fetch(`http://localhost:4000/users/update?usertype=${user.usertype}&firstname=${user.firstname}&lastname=${user.lastname}&email=${user.email}&password=${user.password}`)
      .then(this.getUsers)
      .catch(err => console.error(err))
  }


  renderUser = ({ iduser, usertype, firstname, lastname, email, password }) => <div key={iduser}>{usertype}>{firstname}>{lastname}>{email}>{password}</div>


  render() {
    const data = this.state.users


    const columns = [{
      Header: 'UserType',
      accessor: 'usertype' // String-based value accessors!
    }, {
      Header: 'Firstname',
      accessor: 'firstname',

    }, {
      Header: 'Lastname',
      accessor: 'lastname'
    },
    {
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: 'Password',
      accessor: 'password'
    },
    ]


    const { users, user } = this.state;


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

        {/*users.map(this.renderUser)*/}

        <br></br>
        <div>
          <input value={user.iduser} placeholder="idUser" onChange={e => this.setState({ user: { ...user, iduser: e.target.value } })} />
          <input value={user.usertype} placeholder="userType" onChange={e => this.setState({ user: { ...user, usertype: e.target.value } })} />
          <input value={user.firstname} placeholder="firstName" onChange={e => this.setState({ user: { ...user, firstname: e.target.value } })} />
          <input value={user.lastname} placeholder="lastName" onChange={e => this.setState({ user: { ...user, lastname: e.target.value } })} />
          <input value={user.email} placeholder="email" onChange={e => this.setState({ user: { ...user, email: e.target.value } })} />
          <input value={user.password} placeholder="password" onChange={e => this.setState({ user: { ...user, password: e.target.value } })} />
          <br></br>
          <br></br>
          <ButtonToolbar>
            <Button variant="primary" onClick={this.addUser}>Add user</Button>
            <Button variant="danger" onClick={this.deleteUser}>Delete user </Button>
            <Button variant="secondary" onClick={this.updateUser}>Update user </Button>

          </ButtonToolbar>
          <br></br>
          <br></br>



        </div>



      </div>




    )
  }
}
export default withRouter(Users);