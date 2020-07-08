import React, { useState,useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import '../../App.css'
import {userContext} from '../../App'
const Signin = () => {

    const {state,dispatch} =useContext(userContext)
    const history=useHistory()
  
    const [password, setPassword] = useState("")
    const [email,setEmail] =useState("")
    const PostData = ()=>{
        
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email", classes: '  red accent-3'});  
            return
        }
       
        fetch("/signin",
            {
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
               password,email  
                })
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html:data.error, classes: 'rounded red accent-3'});
                }
                else{

                    //storing token in localstorage  in local storage we can only store strings
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html:"signed in successfully", classes: '  green accent-3'});
                    history.push('/')
                }
            })
            .catch(err =>{
                    console.log(err)
            })
        }
    return (
        <div className="mycard ">
            <div className="card auth-card input-field">
                <h2>Mykindainsta</h2>
                <input
                type="text"
                placeholder="email"
                value={email}
                onChange={e=>{setEmail(e.target.value)}}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e=>{setPassword(e.target.value)}}
            />

                <button onClick={()=>PostData()} className="btn waves-effect waves-light green darken-2
">Login</button>
               <h5>
                   <Link to="/signup">New to Mykindainsta</Link>
               </h5>
            </div>
        </div>
    )
}

export default Signin
