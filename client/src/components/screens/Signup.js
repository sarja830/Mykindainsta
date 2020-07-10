import React, { useState,useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import '../../App.css'

const Signup = () => {
    const history=useHistory()
    const [name,setName]=useState("");
    const [password, setPassword] = useState("")
    const [email,setEmail] =useState("")
    const [image,setImage] =useState("")
    // saving null to db so when not uploading dp it occurs const [url,setUrl]=useState(null)
    const [url,setUrl]=useState(undefined)

useEffect(() => {
  if(url){
      uploadFields()
  }
}, [url])


const uploadPic = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "wefund")
    data.append("cloud_name", "sarthjain830")
    fetch("	https://api.cloudinary.com/v1_1/sarthjain830/image/upload",
        {
            method: "post",
            body: data
        })
        .then(res => res.json())
        .then(data => setUrl(data.secure_url))
        .catch(err => {
            console.log(err)
        })

}



const uploadFields =() =>{
   
   
    fetch("/signup",
        {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
           name,password,email,pic:url  
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



const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html:"Invalid Email", classes: '  red accent-3'});  
        return
    }
    if(image){
        uploadPic()
    }
    else{
        uploadFields()
    }
    
}




  
   
    return (
        <div className="mycard ">
        <div className="card auth-card input-field">
            <h2>Mykindainsta</h2>
            <input
                type="text"
                placeholder="name"
                value={name}
                onChange={e=>{setName(e.target.value)}}
            />
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

 <div className="file-field input-field">
                <div className="btn">
                    <span>upload pic</span>
                    <input type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>

            <button onClick={()=>{PostData()}} className="btn waves-effect waves-light blue darken-1
">Signup</button>
           
           <h5>
               <Link to="/signin">Already have an Account?</Link>
           </h5>
        </div>
    </div>
    )
}

export default Signup
