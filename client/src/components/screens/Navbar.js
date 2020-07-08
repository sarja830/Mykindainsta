import React,{useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../../App.css'
import {userContext} from '../../App'


const Navbar = () => {
const history = useHistory()
const {state,dispatch} = useContext(userContext)

const renderList = ()=>{
  if(state){
    return[
      <>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/createpost">Create Post</Link></li>
      <li><Link to="/myfollowerspost">My following Post</Link></li>

      
      <button 
        onClick={()=>{
          localStorage.clear()
           dispatch({type:"CLEAR"})
           history.push('/signin')
        }}
       className="btn waves-effect waves-light pink darken-2">Log out</button>
      </>
    ]
      
  }
  else{
      return[
        <>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/signin">Signin</Link></li>
        </>
      ]
  }
}
    return (
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo">Mykindainsta</Link>
          <ul id="nav-mobile" className="right ">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}

export default Navbar
