import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../../App.css'
import M from 'materialize-css'
import { userContext } from '../../App'
import { set } from 'mongoose'


const Navbar = () => {

  const searchModal = useRef(null)
    useEffect(() => {
      M.Modal.init(searchModal.current)
    }, [])


  const history = useHistory()
  const { state, dispatch } = useContext(userContext)
  const [search, setSearch] = useState("")
  const [userDetails,setUserDetails] = useState([])

  const renderList = () => {
    if (state) {
      return [
        <>
          <li key="1">
            <i className="large material-icons modal-trigger" data-target="modal1" style={{ color: "black" }}>person_search</i>

          </li>
          <li key="2"><Link to="/profile">Profile</Link></li>
          <li key="3"><Link to="/createpost">Create Post</Link></li>
          <li key="4"><Link to="/myfollowerspost">My following Post</Link></li>


          <button
            onClick={() => {
              localStorage.clear()
              dispatch({ type: "CLEAR" })
              history.push('/signin')
            }}
            className="btn waves-effect waves-light pink darken-2">Log out</button>
        </>
      ]

    }
    else {
      return [
        <>
          <li key="6"><Link to="/signup">Signup</Link></li>
          <li key="7"><Link to="/signin">Signin</Link></li>
        </>
      ]
    }
  }





  const fetchUsers = (query) => {
    setSearch(query)
    fetch('/search-users', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    })
    .then(res => res.json())
    .then(results => {
      setUserDetails(results.user)
        
    })
  }



  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo">Mykindainsta</Link>
        <ul id="nav-mobile" className="right ">
          {renderList()}
        </ul>
      </div>

      {/* MODAL STRUCTURE */}
      <div id="modal1" className="modal" style={{ color: "black" }} ref={searchModal}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => { fetchUsers(e.target.value) }}
          />

          <div class="collection">
            {userDetails.map(item=>{
              return (
              //when logout is done the state is cleared hence it throws error cannt read _id of null ie state._id so a condition to check if state is present or not
                <Link   to={ item._id!== (state?state._id:null) ?"/profile/"+item._id:"/profile"}
                 onClick={
                   ()=>{M.Modal.getInstance(searchModal.current).close()
                  setSearch('')}
                } className="collection-item">{item.email}</Link>
              )
            })}
          
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch("")}}>close</button>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar

