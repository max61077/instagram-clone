import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {
    const history = useHistory()
    const [email, setEmail] = useState('')

    const resetData = () => {
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email", classes: "#e53935 red darken-1"})
            return
        }
        fetch('/reset-password', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
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
                type='text'
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <button onClick={() => resetData()} 
                className='btn waves-effect waves-light #ff8a80 red accent-2'>Reset Password</button>
            </div>
        </div>   
    )
}

export default Reset
