import React,{useEffect,useState,useContext} from 'react'
import '../../App.css';
import {userContext} from '../../App'
import { useParams } from 'react-router-dom';

const UserProfile = () => {

    const [userProfile, setUserProfile] = useState(null)
    const {state,dispatch} = useContext(userContext)
    const {userid} = useParams()
const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true)

    useEffect(() => {
      
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
       
        setUserProfile(result)
          
        })
        
    }, [userid])

   const followUser = ()=>{
       fetch('/follow',{
           method:"put",
           headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
       })
       .then(res=>res.json())
       .then(data=>{
           console.log(data)
           dispatch({type:"UPDATE",payload:{followers:data.followers,following:data.following}})
        localStorage.setItem("user",JSON.stringify(data))
        setUserProfile(previousState=>{
            return {
                ...previousState,
                user:{...previousState.user,
                followers:[...previousState.user.followers,data._id]
            }
            }
        })   
        setShowFollow(false);
       })
   }


   const unfollowUser = ()=>{
    fetch('/unfollow',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
         body:JSON.stringify({
             unfollowId:userid
         })
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        dispatch({type:"UPDATE",payload:{followers:data.followers,following:data.following}})
     localStorage.setItem("user",JSON.stringify(data))
    
     setUserProfile(previousState=>{
        const newFollower = previousState.user.followers.filter(item=>  item!= data._id)
        return {
             ...previousState,
             user:{...previousState.user,
             followers:newFollower
         }
         }
     })
     setShowFollow(true)
    })

}



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
                        src={userProfile.user.pic}></img>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",
                    justifyContent:'space-between'
                    ,width:'108%',
                    
                    }}>
                        <h6>{userProfile.posts.length} Posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                      {showFollow?<button onClick={()=>followUser()} className="btn waves-effect waves-light green darken-2">Follow</button> :                         <button onClick={()=>unfollowUser()} className="btn waves-effect waves-light red darken-2">Unfollow</button>}  

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
