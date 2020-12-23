import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
const Home = () => {
    const [data, setData] = useState(null)
    const {state} = useContext(UserContext)

    useEffect(() => {
        fetch('/allpost', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(res => {
            setData(res.posts)
        })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        }).catch(err => console.log(err))
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        }).catch(err => console.log(err))
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id)
                    return result
                else
                    return item
            })
            setData(newData)
        }).catch(err => console.log(err))
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: 'delete',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            const newData = data.filter(item => {
                return item._id !== result._id
            })

            setData(newData)
        })
    }

    return (
        <>
        {!data ? <h2>Loading...</h2>
        :
        <div className="home">
            {
                data.map(item => {
                    return(
                        <div className="card home-card" key={item._id}>
                            <h3><Link to={`/profile/${item.postedBy._id}`}>{item.postedBy.name}</Link>{item.postedBy._id === state._id && <i 
                            className="small material-icons right del"
                            onClick={() => deletePost(item._id)}
                            >delete</i>}
                            </h3>
                            <div className="card-image">
                                <img src={item.photo} alt={item.title}
                                />
                            </div>
                            <div className="card-content">
                                {
                                    item.likes.includes(state._id)
                                    ? [
                                    <i key={1} className="small material-icons" 
                                    style={{color: 'red'}} >favorite</i>,
                                    <i key={2} className="small material-icons thumb" 
                                    onClick={() => unlikePost(item._id)}>thumb_down</i>
                                    ]
                                    :
                                    [
                                    <i key={3} className="small material-icons" >favorite_border</i>,
                                    <i key={4} className="small material-icons thumb" 
                                    onClick={() => likePost(item._id)}>thumb_up</i>
                                    ]

                                }
                                
                                
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return(
                                            <h6 key={record._id}><span 
                                            style={{fontWeight: '500', marginLeft: '3px'}}>
                                            {record.postedBy.name}</span>  {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={e => {
                                    e.preventDefault()
                                    if(e.target[0].value.trim() !== '')
                                        makeComment(e.target[0].value, item._id)
                                    e.target[0].value = ''
                                }}>
                                    <input type='text' placeholder='Add a comment' />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        }
        </>
    )
}

export default Home
