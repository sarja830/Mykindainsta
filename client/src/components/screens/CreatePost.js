import React, { useState,useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import '../../App.css'

const CreatePost = () => {

    const history = useHistory()
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("")
    const [image, setImage] = useState("initialState")
    const [url, setUrl] = useState("")


    useEffect(() => {
        if(url){
        fetch("/createpost",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization":`Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({
                    title, body, url
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded red accent-3' });
                }
                else {
                    M.toast({ html: "created post succesfuly", classes: '  green accent-3' });
                    history.push('/')
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
        
    }, [url])

    const postDetails = () => {
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




    return (
        <div className="card"
            style={{
                margin: "10px auto",
                maxWidth: "500px"
                , padding: "20px 30px",
                textAlign: "center"
            }}>
            < input
                type="text"
                value={title}
                onChange={e => {
                    setTitle(e.target.value)
                }}
                placeholder="title"></input>
            < input type="text"
                placeholder="body"
                type="text"
                value={body}
                onChange={e => {
                    setBody(e.target.value)
                }}
            ></input>
            <div className="file-field input-field">
                <div className="btn">
                    <span>File</span>
                    <input type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>

            <button
                onClick={() => postDetails()}
                className="btn waves-effect waves-light orange darken-1"
            >
                Submit Post
            </button>
        </div>
    )
}

export default CreatePost
