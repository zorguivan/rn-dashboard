import Home from './components/Home';
import Login from './components/Login';
import Hotels from './components/Hotels';
import React, {useState, useContext, useEffect} from 'react';
import './styling/style.css'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { AuthProvider } from './context/AuthState';
import { HotelProvider } from './context/HotelState';


function App() {
  return (
        <AuthProvider>
            <HotelProvider>
                    <Router>
                        <Switch>
                            <Route path='/login' component={Login} />
                            <Route exact path="/" component={Home} />
                            <Route exact path="/hotels" component={Hotels} />
                            <Route exact path="/hotel/:hotelId" component={Home} />
                        </Switch>
                    </Router> 
            </HotelProvider>
        </AuthProvider>
  );
}

export default App;
