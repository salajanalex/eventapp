import React from 'react';
import { withRouter } from 'react-router';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button,
} from 'reactstrap';

class Login extends React.Component {
    render() {


        return (


            <div>
                <h1 className="welcomeLogin">Welcome</h1>
                <Container className="App">
                    <h2 className="margin">Sign In</h2>
                    <Form className="form">
                        <Col>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="exampleEmail"
                                    placeholder="myemail@email.com"
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="examplePassword"
                                    placeholder="********"
                                />
                            </FormGroup>
                        </Col>
                        <Button className="margin" onClick={() => (this.props.history.push('/home'))}>Submit</Button>
                    </Form>
                </Container>


            </div>
        )
    }
}

export default withRouter(Login);