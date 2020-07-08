import React, { createContext, useContext, useEffect, useReducer } from 'react'
import './App.css';
import Navbar from './components/screens/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home';
import CreatePost from './components/screens/CreatePost';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import Signin from './components/screens/Signin';
import { reducer, initialState } from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import SubscribedUsersPost from './components/screens/SubscribedUsersPost'

export const userContext = createContext()

//switch will ensure one route at a time
const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(userContext)
  
  useEffect(() => {
  
    const user = JSON.parse(localStorage.getItem("user"))
   
    if (user) {
      ///on closing the browser the state will get lost hence the user will be lost but the user hasnt logged out yet so it should not hapeen so we again dispatched
      dispatch({type:"USER",payload:user})
     
    }
    else {
      history.push('/signin')
    }
  }, [])
  return (
    <Switch>
      <Route exact path='/' > <Home /> </Route>
      <Route path='/signin' > <Signin /> </Route>
      <Route path='/signup' > <Signup /> </Route>
      <Route exact path='/profile' > <Profile /> </Route>
      <Route path='/createpost' > <CreatePost /> </Route>
      <Route path='/profile/:userid' > <UserProfile /> </Route>
      <Route path='/myfollowerspost' > <SubscribedUsersPost/> </Route>
    </Switch>
  )
}

// this app cant acces  history since browser router is there
//with the routing we can access the routing inside the app as well
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <div>
          <Navbar></Navbar>
          <Routing></Routing>
        </div>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
