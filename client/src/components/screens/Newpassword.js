import React, {useState} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'

const Newpassword = () => {
    const history = useHistory()
    const [password, setPassword] = useState('')
    const {token} = useParams()

    const postData = () => {
        fetch('/new-password', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
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
    return (
        <div className='loginCard'>
            <div className='auth-card'>
                <h2>Instagram</h2>
                <input
                type='password'
                placeholder="Enter New Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
                <button onClick={() => postData()} 
                className='btn waves-effect waves-light #ff8a80 red accent-2'>Update Password</button>
            </div>
        </div>   
    )
}

export default Newpassword
