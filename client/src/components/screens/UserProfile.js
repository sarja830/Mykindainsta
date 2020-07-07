import React,{useEffect,useState,useContext} from 'react'
import '../../App.css';
import {userContext} from '../../App'
import { useParams } from 'react-router-dom';

const UserProfile = () => {

    const [userProfile, setUserProfile] = useState(null)
    const {state,dispatch} = useContext(userContext)
    const {userid} = useParams()


    useEffect(() => {
      
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            // console.log(result)
        setUserProfile(result)
          
        })
        
    }, [])
    return (<>
    {!userProfile ?<h2>Loading...!</h2>:
        <div style={{maxWidth:"800px",margin:"0px auto" }}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{ width: "150px", height: "160px", borderRadius: "80px" ,borderBottom:"1px solid grey"}}
                        src="https://images.unsplash.com/photo-1571929232190-30f765788262?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1070&q=80"></img>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",
                    justifyContent:'space-between'
                    ,width:'108%',
                    
                    }}>
                        <h6>{userProfile.posts.length} Posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                      {
                          userProfile.posts.map(item=>{
                              return(
                                <img key={item._id} className="item" src={item.photo} alt ={item.title}></img>
                      
                              )
                          })
                      }
                       
                        

            </div>
        </div>}
        </>
    )
}

export default UserProfile
