import styled from "styled-components"
import { useState, useEffect } from 'react'
import Logo from "./assets/logo.png"
import { useNavigate } from "react-router-dom";
import { API_URL } from './main'




export default function RegisterPage(){
    const [file, setPhoto] = useState<any>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [identityKey, setIdentityKey] = useState('');
    const [pIdentityKey, setPIdentityKey] = useState('');

    const navigate = useNavigate();


    useEffect(() => {
        generateIdentityKey();
    }, [])

    async function register(){

        let photo;

        var reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = async function() {
            photo = reader.result;
            // console.log(JSON.stringify({name, email, password, identityKey, photo: photo}));
            
            await fetch(`${API_URL}/user/create`, {
            method: 'POST',
            body: JSON.stringify({name, email, password, identityKey, photo}),
            headers: {
                'Content-Type': 'application/json'
            },
            
        }).then(response => response.json()).then( data => {
            console.log(data);
            localStorage.setItem('email', email);
            localStorage.setItem('identityKey', identityKey);
            localStorage.setItem('pIdentityKey', pIdentityKey);
            
        }
        );
        
        navigate('/')
    }
    }

    async function generateIdentityKey(){
        function arrayBufferToHex(arrayBuffer:ArrayBuffer) {
            const view = new DataView(arrayBuffer);
            const hexParts = [];
            for (let i = 0; i < view.byteLength; i++) {
              const hex = view.getUint8(i).toString(16).padStart(2, '0');
              hexParts.push(hex);
            }
            return hexParts.join('');
        };

        const keyPair = await crypto.subtle.generateKey({
            name: 'ECDH',
            namedCurve: 'P-256'
            }, true, ['deriveKey'])
            
        let buffer = await crypto.subtle.exportKey('raw', keyPair.publicKey);
        const publicHex = arrayBufferToHex(buffer);
        setIdentityKey(publicHex);
        let privateBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        setPIdentityKey(arrayBufferToHex(privateBuffer));
    }


    return(
        <Container>
            <Img src={Logo} />
            <Form>
                <ProfilePicSelector src={file && URL.createObjectURL(file)} onClick={() => document.getElementById('InputFile')?.click()}/>
                <InputFile id="InputFile" accept="image/*" placeholder="profile pic" type="file" onChange={(event)=>{ setPhoto(event.target.files![0])}}></InputFile>
                <Input placeholder="name" onChange={(e) => setName(e.target.value)}></Input>
                <Input placeholder="email" type="email" onChange={(e) => setEmail(e.target.value)}></Input>
                <Input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}></Input>
                <Input type="password" placeholder="confirm password"></Input>
                <SendButton type="button" onClick={register}>Register</SendButton>
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
    font-family: 'Open Sans', sans-serif;
    `

const Img = styled.img`
    width: 20rem;
    `

const ProfilePicSelector = styled.img<{ $backgroundimage?: any }>`
    cursor: pointer;
    background-color: #adacac;
    object-fit: cover;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    align-self: center;
    margin-bottom: 1rem;
`

const InputFile = styled.input`
    height: 0rem;
    width: 0rem;
    visibility: hidden;
    margin-top: -.5rem;
`

const Input = styled.input`
    font-family: 'Open Sans', sans-serif;
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
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    margin-top: 1rem;


    &:hover {
        box-shadow: 0px 0px 5px black;
    }
    font-size: medium;
`