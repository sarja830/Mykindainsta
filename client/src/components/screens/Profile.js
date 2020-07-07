import React,{useEffect,useState,useContext} from 'react'
import '../../App.css';
import {userContext} from '../../App'

const Profile = () => {

    const [myPics, setMyPics] = useState([])
    const {state,dispatch} = useContext(userContext)



    useEffect(() => {
      
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            setMyPics(result.myposts)
        })
        
    }, [])
    return (
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
                    <h4>{state?state.name:"Loading"}</h4>
                    <div style={{display:"flex",
                    justifyContent:'space-between'
                    ,width:'108%',
                    
                    }}>
                        <h6>40 posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
            {myPics.length==0?<h2>Loading...!</h2>:
                          myPics.map(item=>{
                              return(
                                <img key={item._id} className="item" src={item.photo} alt ={item.title}></img>
                      
                              )
                          })
            }
                       
                        

            </div>
        </div>
    )
}

export default Profile
