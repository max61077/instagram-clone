import React, {useEffect, createContext, useReducer, useContext} from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import SignIn from './components/screens/SignIn';
import Profile from './components/screens/Profile';
import SignUp from './components/screens/SignUp';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'
import {BrowserRouter, Route, useHistory} from 'react-router-dom';
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {

  const history = useHistory()
  const {dispatch} = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
      dispatch({type: "USER", payload: user})
    }
    else if(!history.location.pathname.startsWith('/reset'))
      history.push('/signin')
  }, [])
  return(
    <>
      <Route exact path='/'>
        <Home/>
      </Route>
      <Route path='/create'>
        <CreatePost/>
      </Route>
      <Route path='/signin'>
        <SignIn/>
      </Route>
      <Route exact path='/profile'>
        <Profile/>
      </Route>
      <Route path='/signup'>
        <SignUp/>
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile/>
      </Route>
      <Route exact path='/reset'>
        <Reset/>
      </Route>
      <Route path='/reset/:token'>
        <Newpassword/>
      </Route>
    </>
  )
}

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
        <BrowserRouter>
          <Navbar/>
          <Routing/>
        </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
