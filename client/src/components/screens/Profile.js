import React, {useState, useEffect, useContext, useRef} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Profile = () => {
    const {state, dispatch} = useContext(UserContext)
    const [pics, setPics] = useState([])
    const [image, setImage] = useState()
    const picModal = useRef(null)

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(res => {
            setPics(res.mypost)
        })
        M.Modal.init(picModal.current)
    }, [])

    const uploadPic = () => {
        if(!image)
            return M.toast({html: "Field Empty", classes:"#e53935 red darken-1"})
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
            M.Modal.getInstance(picModal.current).close()
            savePic(data)
        })
        .catch(err => console.log(err))
    }
    
    const savePic = (data) => {
        fetch('/updatepic', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                pic: data.url
            })
        }).then(res => res.json())
        .then(result => {
            localStorage.setItem('user', JSON.stringify({...state, pic: result.pic}))
            dispatch({type: "UPDATEPIC", payload: result.pic})
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="profile">
            <div className="userProfile">
                <div className="profilepic">
                    
                    <img alt={"dp"} src={state?state.pic:"loading..."} />
                    <a className="waves-effect waves-light btn modal-trigger mpr" 
                    href="#picmodal"><i className="small material-icons">camera_alt</i></a>
                    
                    <div id="picmodal" className="modal" ref={picModal}>
                        <div className="modal-content">
                            <h2>Update Profile Pic</h2>
                            <div className="file-field input-field">
                                <div className="btn">
                                    <span>Choose Pic</span>
                                    <input 
                                    type="file"
                                    onChange={e => setImage(e.target.files[0])}
                                    />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text"/>
                                </div>
                            </div>
                            <button onClick={() => uploadPic()} 
                            className='btn waves-effect waves-light #ff8a80 red accent-2'>Upload</button>

                        </div>
                        <div className="modal-footer">
                            <a href="#!" className="modal-close waves-effect waves-green btn-flat">
                                <i className="material-icons">clear</i>
                            </a>
                        </div>
                    </div> 
                </div>
                <div className="profileDetails">
                    <h4>{state?state.name:'Loading...'}</h4>
                    <div className="userDetails">
                        <h6>{pics.length} Posts</h6>
                        <h6>{state?state.followers.length:"0"} Followers</h6>
                        <h6>{state?state.following.length:"0"} Following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    pics.map(pic => {
                        return(
                            <img key={pic._id} src={pic.photo} alt={pic.title}/> 
                        )
                    })
                }
            </div>
        </div>
    )

    
}

export default Profile
