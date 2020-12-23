import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState('')
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')

    useEffect(() => {
        if(url){
            fetch('/createpost', {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    title,
                    body: caption,
                    pic: url
                })
            }).then(res => res.json())
            .then(data => {
                if(data.error)
                    M.toast({html: data.error, classes:"#e53935 red darken-1"})
                else{
                    M.toast({html: "Post Created", classes:"#43a047 green darken-1"})
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

        data.append('file', image)
        data.append('upload_preset', 'insta-clone')
        data.append('cloud_name', 'max12')
        fetch('https://api.cloudinary.com/v1_1/max12/image/upload', {
            method: 'post',
            body: data
        })
        .then(res => res.json())
        .then(data => {
            setUrl(data.url)
        })
        .catch(err => console.log(err))

        
    }

    return (
        <div className="card input-field">
            <h2>Upload Post</h2>
            <input 
            type='text' 
            placeholder='Title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            />
            <input 
            type='text' 
            placeholder='Caption'
            value={caption}
            onChange={e => setCaption(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Choose Image</span>
                    <input 
                    type="file"
                    onChange={e => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button onClick={() => postDetails()} className='btn waves-effect waves-light #ff8a80 red accent-2'>Upload</button>
        </div>
    )
}

export default CreatePost
