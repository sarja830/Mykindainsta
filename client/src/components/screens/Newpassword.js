import React, { useState,useEffect, useContext } from 'react'
import { Link, useHistory,useParams } from 'react-router-dom'
import M from 'materialize-css'
import '../../App.css'

const Newpassword = () => {

  
    const history=useHistory()
  const {token} =useParams()
    const [password, setPassword] = useState("")
   console.log(token)
    const PostData = ()=>{
        
       
       
        fetch("/new-password",
            {
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
               password ,token 
                })
            })
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
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
                type="password"
                placeholder="password"
                value={password}
                onChange={e=>{setPassword(e.target.value)}}
            />

                <button onClick={()=>PostData()} className="btn waves-effect waves-light green darken-2
">Update Password</button>
              
            </div>
        </div>
    )
}

export default Newpassword
