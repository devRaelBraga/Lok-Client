import styled from "styled-components"
import { useState, useEffect } from 'react'
import Logo from "./assets/logo.png"
import loadingGif from "./assets/loading.gif"
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();


    async function login() {
        setLoading(true);


        await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        }).then(response => response.json()).then(data => {
            if(data.status) {
                console.log(data)
                throw new Error(data.status)
            }
            localStorage.setItem('email', data.email);
            localStorage.setItem('identityKey', data.identityKey);
            alert('login successful')
            console.log(data)
            setLoading(false);
            // navigate('chat')
        }).catch(error => alert(error));

        setTimeout(() => navigate('chat'), 2000)
    }
    

    return(
        <Container>
            <Img src={Logo}/>
            <Form  className="flex flex-col">
                <Input placeholder="email" onChange={(e) => setEmail(e.target.value)}></Input>
                <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}></Input>
                <SendButton type="button" onClick={login} >{loading ? <img src={loadingGif}></img> : 'Login'}</SendButton>
            </Form>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const Img = styled.img`
    width: 20rem;
`

const Input = styled.input`
    padding: 1rem;
    border-radius: 6px;
    border: none;
    font-size: medium;
    
    &:focus{
        /* border: 1px solid blue; */
        outline: none;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 600px;
    gap: .5rem;
    width: 20rem;
`

const SendButton = styled.button`
    padding: 1rem;
    background-color: #5f618e;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    transition: 200ms ease-in-out;

    &:hover {
        box-shadow: 0px 0px 5px black;
    }
    font-size: medium;

    img {
        width: 1.5rem;
    }
`