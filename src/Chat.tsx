import styled from "styled-components"
import { useState, useEffect } from 'react'
import Logo from "./assets/logo.png"
import SendIcon from "./assets/send-icon.svg"
// import { useGenerateKeyHook, useGetKeyHook } from "./hooks/encryptionHook";
import io, { Socket } from 'socket.io-client';
import { useCreateGroupHook } from "./abc";
import { API_URL } from './main'

type Message = {
    message: string,
    fromMe: boolean,
}

function arrayBufferToHex(arrayBuffer:ArrayBuffer) {
    const view = new DataView(arrayBuffer);
    const hexParts = [];
    for (let i = 0; i < view.byteLength; i++) {
      const hex = view.getUint8(i).toString(16).padStart(2, '0');
      hexParts.push(hex);
    }
    return hexParts.join('');
};

export default function ChatPage(){

    const [users, setUsers] = useState<any[]>([]);
    const [addedUser, setAddedUser] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>();
    const [rawKey, setRawKey] = useState<any>();
    const [shared, setSharedKey] = useState<any>();
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        async function getUsers() {
            await fetch(`${API_URL}/user`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: String(localStorage.getItem('email'))})
        }).then((response) => response.json()).then((data) => {
            setUsers(data)
            console.log(data)
        })
        }
        getUsers()

    }, [])

    useEffect(() => {
        function hexToArrayBuffer(hexString:string) {
            const buffer = new ArrayBuffer(hexString.length / 2);
            const view = new DataView(buffer);
          
            for (let i = 0; i < hexString.length; i += 2) {
              const byteValue = parseInt(hexString.substr(i, 2), 16);
              view.setUint8(i / 2, byteValue);
            }
    
            return buffer;
        }
        async function getRawKey(){
            try {
                let rawKey:any = await crypto.subtle.importKey('raw', hexToArrayBuffer(selectedUser.identityKey), {
                    name: 'ECDH',
                    namedCurve: 'P-256'
                }, true, []).catch(err => console.log(err));
                setRawKey(rawKey);
            } catch (error) {
                
            }
        }

        getRawKey()
    }, [selectedUser])

    useEffect( () => {
        let myPrivateKey = String(localStorage.getItem('pIdentityKey'))

        function hexToArrayBuffer(hexString:string) {
            const buffer = new ArrayBuffer(hexString.length / 2);
            const view = new DataView(buffer);
          
            for (let i = 0; i < hexString.length; i += 2) {
              const byteValue = parseInt(hexString.substr(i, 2), 16);
              view.setUint8(i / 2, byteValue);
            }
    
            return buffer;
        }

        async function generate() {
            let privateKey:any = await crypto.subtle.importKey('pkcs8', hexToArrayBuffer(myPrivateKey), {
                name: 'ECDH',
                namedCurve: 'P-256'
            }, true, ['deriveKey']).catch(err => console.log(err.message));

            try {
                const sharedkey = await crypto.subtle.deriveKey(
                    {
                        name: 'ECDH',
                        public: rawKey,
                    },
                    privateKey,
                    {
                        name: 'AES-GCM',
                        length: 256
                    },
                    true,
                    ['encrypt', 'decrypt']
                  );
    
                  setSharedKey(sharedkey);
                  console.log(sharedkey);
                  console.log(sharedkey);
                  return(sharedkey);
            } catch (error) {
                console.log(error);
            }
        }

        generate()
    }, [rawKey])

    useEffect(() => {
        const newSocket = io(`${API_URL}`);

        function hexToArrayBuffer(hexString:string) {
            const buffer = new ArrayBuffer(hexString.length / 2);
            const view = new DataView(buffer);
          
            for (let i = 0; i < hexString.length; i += 2) {
              const byteValue = parseInt(hexString.substr(i, 2), 16);
              view.setUint8(i / 2, byteValue);
            }
    
            return buffer;
        }
      
        newSocket.on('connect', () => {
          console.log('Conexão estabelecida');
        });
      
        newSocket.on(String(localStorage.getItem('email')), async (message: number[]) => {
            console.log('oi');
                const textDecoder =  new TextDecoder();
                const ivBytes = new Uint8Array(12);
                const ArrayBuffer = new Uint8Array(message).buffer;

                console.log(ArrayBuffer)

                const buffer = await crypto.subtle.decrypt({
                    name: 'AES-GCM',
                    iv: ivBytes
                    }, shared, ArrayBuffer);

                console.log(buffer);
                
                const decoded = textDecoder.decode(buffer);
                console.log(decoded);
                setChat((prevMessages) => [...prevMessages, {message: decoded, fromMe: false}]);
                
        });

        newSocket.on('group-' + String(localStorage.getItem('email')), async (message: string) => {
            console.log('Adicionado a um grupo!');
                
            const payload = await JSON.parse(message);

            const textDecoder =  new TextDecoder();
            const ivBytes = new Uint8Array(12);
            const ArrayBuffer = new Uint8Array(payload.message).buffer;

            console.log(payload)

            let adminKey = await users.find(user => user.email == payload.sender)
            
            console.log('public:', adminKey);

            adminKey = await crypto.subtle.importKey('raw', hexToArrayBuffer(adminKey.identityKey), {
                name: 'ECDH',
                namedCurve: 'P-256'
            }, true, []).catch(err => console.log(err))

            let privateKey:any = await crypto.subtle.importKey('pkcs8', hexToArrayBuffer(String(localStorage.getItem('pIdentityKey'))), {
                name: 'ECDH',
                namedCurve: 'P-256'
            }, true, ['deriveKey']).catch(err => console.log(err.message));


            const sharedkey = await crypto.subtle.deriveKey(
                {
                    name: 'ECDH',
                    public: adminKey,
                },
                privateKey,
                {
                    name: 'AES-GCM',
                    length: 256
                },
                true,
                ['encrypt', 'decrypt']
                );


            // const buffer = await crypto.subtle.decrypt({
            //     name: 'AES-GCM',
            //     iv: ivBytes
            //     }, sharedkey, ArrayBuffer);

            // console.log(buffer);
            
            // const decoded = textDecoder.decode(buffer);
            

            let groupKey = await crypto.subtle.importKey('raw', hexToArrayBuffer(payload.key), {
                name:'AES-GCM',
            }, true, ["encrypt"])

            console.log('grupo: ',groupKey);
            console.log(payload.name)

            localStorage.setItem(payload.name, arrayBufferToHex(await crypto.subtle.exportKey('raw', groupKey)))

        });

      
        newSocket.on('error', (error: any) => {
          console.error('Erro na conexão:', error);
        });

      
        setSocket(newSocket);
      
        return () => {
          if (newSocket) {
            newSocket.disconnect();
          }
        };

    }, [shared]);
    
    
    async function sendMessage() {
        const textEconder =  new TextEncoder();
        const ivBytes = new Uint8Array(12);

        const buffer = await crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: ivBytes
        }, shared, textEconder.encode(message))

    
        const byteArray = Array.from(new Uint8Array(buffer));
    
        const jsonMessage = JSON.stringify({
            message: byteArray,
            receiver: selectedUser.email
        })

        if (socket) {
            socket.emit('message', jsonMessage);
        }

        // setMessages((prevMessages) => [...prevMessages, messageInput])
        setChat((prevMessages) => [...prevMessages, {message: message, fromMe: true}])
        setMessage('');
    };

    async function addToGroup(){
        // let

        const jsonMessage = JSON.stringify({
            receiver: addedUser,
            key: localStorage.getItem(selectedUser.name),
            sender: localStorage.getItem('email'),
            name: selectedUser.name
        })

        if(socket){
            socket.emit('addUserToGroup', jsonMessage);
        }

        await fetch(`${API_URL}/message/group/addUser`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({adminId: String(localStorage.getItem('email')), name: selectedUser.name, userEmail: addedUser})
        }).then((response) => response.json()).then((data) => {
            console.log(data);
        })

    }

    async function handleAddUser(){
        console.log('addUserToGroup');
        await addToGroup();
    }
    

    return(
        <Container>
            <Img src={Logo}></Img>

            <Contacts>

                {users && users.map((user, index) => 
                // <>
                    // <Contact onClick={() => setSelectedUser(user)} key={index} $active={selectedUser?.name == user.name ? true :false}>{user.name}</Contact>
                    user.email != localStorage.getItem('email') &&
                    <Contact onClick={() => setSelectedUser(user)} key={index} $active={selectedUser?.name == user.name ? true :false}>
                        <img ></img>
                        <p>{user.name}</p>
                    </Contact>
                // </>
                )}
            </Contacts>

            <ChatContainer>
                {selectedUser && selectedUser.adminId != undefined && 
                <>
                    <input type="text" value={addedUser} onChange={(e) => setAddedUser(e.target.value)}/>
                    <button onClick={handleAddUser}>
                        Adicionar Usuários
                    </button>
                </>
                }
                <Chat>
                    {/* <p>{String(shared)}</p> */}
                    {/* <input type="text" placeholder="key" value={key} onChange={(e) => setKey(e.target.value)}/> */}
                    {/* <input type="text" placeholder="receiver" onChange={(e) => setReceiver(e.target.value)}/> */}

                    {chat &&chat.map((item, index) => <Message $fromme={item.fromMe} key={index}>{item.message}</Message>)}
                </Chat>


                <WriteMessage>
                    <MessageField placeholder="Write a message..." value={message} onChange={(e) => setMessage(e.target.value)}></MessageField>
                    <SendMessageButton onClick={() => sendMessage()}>
                        <Icon src={SendIcon}></Icon>
                    </SendMessageButton>
                </WriteMessage>
            </ChatContainer>

        </Container>
    )
}

const Message = styled.div< {$fromme: boolean} >`
    width: 10rem;
    /* height: 3rem; */
    color: white;
    padding: 1.5rem;
    background-color: #272740;
    border-radius: 1rem;
    ${props => props.$fromme ? 'border-top-right-radius: 0px' : 'border-top-left-radius: 0px'};
    margin-top: 1rem;
    align-self: ${props => props.$fromme ? 'self-end' : 'self-start'};
    position: relative;

    &::before {
        width: 10px;
        height: 10px;
        content: '';
        position: absolute;
        background-color: #272740;
        ${props => props.$fromme ? 'right: -10px' : 'left: -10px'};
        top: 0px;
    }

    &::after {
        width: 20px;
        height: 20px;
        content: '';
        position: absolute;
        background-color: #171726;
        ${props => props.$fromme ? 'right: -20px' : 'left: -20px'};
        top: -1px;
        border-radius: 50%;
    }
`

const Img = styled.img`
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 8rem;
`


const Icon = styled.img`
    width: 2rem;
`

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    `

const Contacts = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    height: 100%;
    border-right: 1px solid black !important;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 0px;
    }
`

const Contact = styled.div< {$active:boolean} >`
    color: white;
    padding: 2rem;
    border-bottom: 1px solid black;
    cursor: pointer;
    background-color: ${props => props.$active ? '#202035' : 'transparent'};
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: larger;

    img {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        object-fit: cover;
    }
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 80vh;
    margin-left: 20vw;
    width: 70vw;
    font-family: 'Open Sans', sans-serif;
    background-color: #171726;
    margin-top: 10vh;
    border-radius: 12px;
`

const Chat = styled.div`
    display: flex;
    flex-direction: column;
    height: 90%;
    width: calc(100% - 4rem);
    padding-top: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
    overflow-y: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        width: 0px;
    }
`

const WriteMessage = styled.div`
    display: flex;
    height: 10%;
    width: 100%;
    `

const MessageField = styled.input`
    width: 90%;
    background-color: #100f21;
    border: none;
    border-bottom-left-radius: 12px;
    color: #e0e0e0;
    padding: 1rem;
    font-size: medium;

    &:focus {
        outline: none;
    }

`

const SendMessageButton = styled.button`
    border-bottom-right-radius: 12px;
    width: 10%; 
    background-color: #100f21;
    border: none;
    /* border-left: 1px solid #000000; */
    cursor: pointer;

    &:hover {
        filter: brightness(1.3);
    }
`
