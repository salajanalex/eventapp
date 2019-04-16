// npm start -> frontend
import React ,{Component} from 'react'
import ReactTable from "react-table"
import './style.css'
import 'react-table/react-table.css'

import {Navbar,Nav,ButtonToolbar,Button} from 'react-bootstrap'






class App extends Component{


    state={
        users: [],
        user:{
            iduser: '',
            usertype: '',
            firstname: '',
            lastname: '',
            email:'',
            password:''

        }
    }

    componentDidMount(){
    this.getUsers();
    }

    getUsers  = _ => {
        fetch('http://localhost:4000/users',)
        .then(response => response.json())
        .then(response => this.setState({users: response.data}))
        .catch(err => console.error(err) )
    }

    addUser = _ => {
        const user = this.state.user;
        fetch(`http://localhost:4000/users/add?iduser=${user.iduser}&usertype=${user.usertype}&firstname=${user.firstname}&lastname=${user.lastname}&email=${user.email}&password=${user.password}`)
        .then(this.getUsers)
        .catch(err => console.error(err))



    }
    

    
    renderUser = ({iduser,usertype,firstname,lastname,email,password}) => <div key={iduser}>{usertype}>{firstname}>{lastname}>{email}>{password}</div>

    render(){
        const data = this.state.users
    

        const columns = [{
            Header: 'UserType',
            accessor: 'usertype' // String-based value accessors!
          }, {
            Header: 'Firstname',
            accessor: 'firstname',
           
          }, {
            Header:'Lastname',
            accessor: 'lastname'
          },
          {
            Header:'Email',
            accessor: 'email'
          },
          {
            Header:'Password',
            accessor: 'password'
          },
       ]
    

        const {users,user} = this.state;

      


        return(
         
            <div className="App">

<Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">EventApp</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#">Home</Nav.Link>
      <Nav.Link href="#">Events</Nav.Link>
      <Nav.Link href="#">Tickets</Nav.Link>
      <Nav.Link href="http://localhost:3000">Users</Nav.Link>
      
    </Nav>
    </Navbar>


            <ReactTable
            data={data}
            columns={columns}
            />

            {/*users.map(this.renderUser)*/}

            <div>
                <input value ={user.iduser} placeholder="idUser" onChange={e => this.setState({ user: { ...user, iduser: e.target.value }})} />
                <input value ={user.usertype} placeholder="userType" onChange={e => this.setState({ user: { ...user, usertype: e.target.value }})} />
                <input value ={user.firstname} placeholder="firstName" onChange={e => this.setState({ user: { ...user, firstname: e.target.value }})} />
                <input value ={user.lastname} placeholder="lastName" onChange={e => this.setState({ user: { ...user, lastname: e.target.value }})} />
                <input value ={user.email} placeholder="email" onChange={e => this.setState({ user: { ...user, email: e.target.value }})} />
                <input value ={user.password} placeholder="password" onChange={e => this.setState({ user: { ...user, password: e.target.value }})} />
                <ButtonToolbar>
                <Button variant="primary" onClick = {this.addUser}>Add user</Button>
                <Button variant="danger">Delete user </Button>
                <Button variant="warning">Update user</Button>
                </ButtonToolbar>
                


            </div>

            

            </div>

           
        )
    }
}

export default App