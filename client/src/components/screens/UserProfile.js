import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile = () => {
    const {state, dispatch} = useContext(UserContext)
    const [profile, setProfile] = useState(null)
    const [following, setFollowing] = useState(false)
    const {userid} = useParams()

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(res => {
            setFollowing(res.user.followers.includes(JSON.parse(localStorage.getItem('user'))._id))
            setProfile(res)
        })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
        .then(data => {
            dispatch({type: 'UPDATE', payload: {following: data.following, followers: data.followers}})
            localStorage.setItem('user', JSON.stringify(data))

            setProfile(prevState => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                }
            })
            setFollowing(true)
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
        .then(data => {
            dispatch({type: 'UPDATE', payload: {following: data.following, followers: data.followers}})
            localStorage.setItem('user', JSON.stringify(data))

            setProfile(prevState => {
                const newFollower = prevState.user.followers.filter(user => user !== data._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollower  
                    }
                }
            })
            setFollowing(false)
        })
    }

    return (
        <>
        {!profile ? <h2>Loading....</h2>
        :
        <div className="profile">
            <div className="userProfile">
                <div className="profilepic">
                    <img alt={"dp"} src={profile.user.pic} 
                     />
                </div>
                <div className="profileDetails">
                    <h4>{profile.user.name}</h4>
                    {   profile.user._id !== state._id?
                        !following
                        ?
                        <div onClick={() => followUser()} className='followBtn'><span>Follow</span></div>
                        :
                        <div onClick={() => unfollowUser()} className='followBtn'><span>Unfollow</span></div>
                        :
                        <div style={{margin: "40px auto"}}></div>
                    }
                    
                    <div className="userDetails">
                        <h6>{profile.posts.length} Posts</h6>
                        <h6>{profile.user.followers.length} Followers</h6>
                        <h6>{profile.user.following.length} Following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    profile.posts.map(post => {
                        return(
                            <img key={post._id} src={post.photo} alt={post.title}/> 
                        )
                    })
                }
            </div>
        </div>
        }
        </>
    )
}

export default UserProfile
