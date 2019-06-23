import { BrowserRouter , Route } from 'react-router-dom'
import React from 'react';

import Home from './components/Home'
import Events from './components/Events'
import Tickets from './components/Tickets'
import Users from './components/Users'
import Login from './components/Login'

class Routes extends React.Component {
    render(){

        
       return(
        
        <BrowserRouter >
        
       
            
            <Route path="/" component={Login} exact> 
            
                <Route component={Login}/>
                <Route path="/home" component = {Home} />
                <Route path="/events" component={Events}/> 
                <Route path="/tickets" component={Tickets}/> 
                <Route path="/users" component={Users}/> 
                
            
            </Route>
            
    
        </BrowserRouter>
        )
     }
}

export default Routes;

