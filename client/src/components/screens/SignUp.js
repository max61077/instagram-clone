import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'

import M from 'materialize-css'

const SignUp = () => {
    const history = useHistory()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if(url)
            uploadFields()
    }, [url])

    const uploadFields = () => {
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email", classes: "#e53935 red darken-1"})
            return
        }
        fetch('/signup', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error)
                M.toast({html: data.error, classes:"#e53935 red darken-1"})
            else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    const postData = () => {
        if(image)
            uploadPic()
        else
            uploadFields()
    }

    const uploadPic = () => {
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
        <div className='loginCard'>
            <div className='auth-card'>
                <h2>Instagram</h2>
                <input
                type='text'
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                />
                <input
                type='text'
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <input
                type='password'
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Profile Pic</span>
                        <input 
                        type="file"
                        onChange={e => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button onClick={() => postData()} className='btn waves-effect waves-light #ff8a80 red accent-2'>SignUp</button>
                <h6>Already have an account ? <Link to='/signin'>SignIn</Link></h6>
            </div>
        </div>   
    )
}

export default SignUp
