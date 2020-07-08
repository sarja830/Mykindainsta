import React, { useEffect, useState, useContext } from 'react'
import '../../App.css';
import { userContext } from '../../App'

const Profile = () => {

    const [myPics, setMyPics] = useState([])
    const { state, dispatch } = useContext(userContext)

    //for profile picture uplaod
    const [image, setImage] = useState("")
    // saving null to db so when not uploading dp it occurs const [url,setUrl]=useState(null)
    const [url, setUrl] = useState(undefined)

//thi use ffetct we are doing so that  so that the lines of code execute after the set image is performed
useEffect(() => {
    if(image){
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
            .then(data => {
                setUrl(data.secure_url)
              
                // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                // dispatch({type:"UPDATEPIC" ,payload:data.url})
                fetch('/updatepic',{
                    method:'put',
                    headers:{
                        "content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")    
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })

                })
                .then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
                    dispatch({type:"UPDATEPIC" ,payload:data.url})
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    
}, [image])

    const updatePhoto = (file) => {
        setImage(file)
       
    }


    useEffect(() => {

        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                setMyPics(result.myposts)
            })

    }, [])
    return (
        <div style={{ maxWidth: "800px", margin: "0px auto" }}>
            <div style={{
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }} >
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div>
                        <img style={{ width: "230px", height: "230px", borderRadius: "100%", borderBottom: "1px solid grey" }} src={state ? state.pic : "loading"}></img>
                    </div>
                    <div>
                        <h4>{state ? state.name : "Loading"}</h4>
                        <h4>{state ? state.email : "Loading"}</h4>
                        <div style={{
                            display: "flex",
                            justifyContent: 'space-between'
                            , width: '108%',

                        }}>
                            <h6>{myPics.length} posts</h6>
                            <h6>{state ? state.followers.length : "0"} followers</h6>
                            <h6>{state? state.following.length : "0"} following</h6>
                        </div>

                    </div>






                </div>

                <div className="file-field input-field">
                    <div className="btn">
                        <span>update pic</span>
                        <input type="file"
                            onChange={(e) => updatePhoto(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                
           



            </div>
            <div className="gallery">
                {myPics.length == 0 ? <h2>Loading...! or no post to show</h2> :
                    myPics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title}></img>

                        )
                    })
                }




            </div >
        </div>
    )
}

export default Profile
