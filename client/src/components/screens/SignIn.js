import React, {useState, useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const SignIn = () => {
    const {dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const postData = () => {
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html: "Invalid Email", classes: "#e53935 red darken-1"})
            return
        }
        fetch('/signin', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error)
                M.toast({html: data.error, classes:"#e53935 red darken-1"})
            else{
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type: "USER", payload: data.user})
                M.toast({html: "SignIn Success", classes:"#43a047 green darken-1"})
                history.push('/')
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
                <input
                type='password'
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
                <button onClick={() => postData()} className='btn waves-effect waves-light #ff8a80 red accent-2'>Login</button>
                <h6>Don't have an account ? <Link to='/signup'>SignUp</Link></h6>
                <h6><Link to='/reset'>Forgot Password ?</Link></h6>
            </div>
        </div>   
    )
}

export default SignIn
