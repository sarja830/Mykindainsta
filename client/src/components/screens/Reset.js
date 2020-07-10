import React, { useState,useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import '../../App.css'
import {userContext} from '../../App'
const Reset = () => {

   
    const history=useHistory()
  
    const [email,setEmail] =useState("")
    const PostData = ()=>{
        
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email", classes: '  red accent-3'});  
            return
        }
       
        fetch("/reset-password",
            {
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
               email  
                })
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:data.error, classes: 'rounded red accent-3'});
                }
                else{
                    M.toast({html:data.message, classes: '  green accent-3'});
                    history.push('/signin')
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
                placeholder="Enter your registered email"
                value={email}
                onChange={e=>{setEmail(e.target.value)}}
            />

                <button onClick={()=>PostData()} className="btn waves-effect waves-light green darken-2
">reset password</button>
              
            </div>
        </div>
    )
}

export default Reset
