import io, { Socket } from 'socket.io-client';
import styles from './GroupAddMembers.module.css'
import { useState, useEffect } from 'react'
import { API_URL } from './main'
import { useParams } from 'react-router-dom'

export default function AddMembersToGroup() {
  const [addedMembers, setAddedMembers] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [usersToAdd, setUsersToAdd] = useState<any[]>([])
  const [socket, setSocket] = useState<any>()
  const { id } = useParams();
  const { name } = useParams();

  function hexToArrayBuffer(hexString:string) {
      const buffer = new ArrayBuffer(hexString.length / 2);
      const view = new DataView(buffer);
    
      for (let i = 0; i < hexString.length; i += 2) {
        const byteValue = parseInt(hexString.substr(i, 2), 16);
        view.setUint8(i / 2, byteValue);
      }

      return buffer;
  }

  useEffect(() => {
        const newSocket = io(`${API_URL}`);

        newSocket.on('connect', () => {
          console.log('Conexão estabelecida');
        });
        newSocket.on('disconnect', () => {
          console.log('Desconectado');
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
}, []);

  async function addToGroup(addedUser:any){
        
    let privateKey:any = await crypto.subtle.importKey('pkcs8', hexToArrayBuffer(String(localStorage.getItem('pIdentityKey'))), {
        name: 'ECDH',
        namedCurve: 'P-256'
    }, true, ['deriveKey']).catch(err => console.log(err.message));

    // users.find(user => user.email == addedUser).identityKey

    let userKey:any = await crypto.subtle.importKey('raw', hexToArrayBuffer(String(users.find(user => user.email == addedUser.email).identityKey)), {
        name: 'ECDH',
        namedCurve: 'P-256'
    }, true, []).catch(err => console.log(err))
    console.log('[userKey]', userKey)

    let key = await crypto.subtle.deriveKey(
        {
            name: 'ECDH',
            public: userKey,
        },
        privateKey,
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
        );
        
    console.log('[key]', key)

    const ivBytes = new Uint8Array(12);
    const textEconder =  new TextEncoder();

    
    const buffer = await crypto.subtle.encrypt({
        name: 'AES-GCM',

        iv: ivBytes
    }, key, textEconder.encode(String(localStorage.getItem('group:' + name))))

    const byteArray = Array.from(new Uint8Array(buffer));

    const jsonMessage = JSON.stringify({
        receiver: addedUser.email,
        key: byteArray,
        sender: localStorage.getItem('email'),
        name: name
    })

    if(socket){
        socket.emit('addUserToGroup', jsonMessage);
    }

    await fetch(`${API_URL}/message/group/addUser`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({adminId: String(localStorage.getItem('email')), name: name, userEmail: addedUser})
    }).then((response) => response.json()).then((data) => {
        console.log(data);
    })

  }

  useEffect(() => {
    async function getUsers() {
      await fetch(`${API_URL}/message/group/usersOnGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setUsers(data.notMembers)
          setAddedMembers(data.members)
        })
    }
    getUsers()
  }, [])

  function addMemberToGroup(user: any) {
    setAddedMembers([...addedMembers, user])
    setUsersToAdd([...usersToAdd, user])
  }

  function removeMemberToGroup(user: any) {
    const newMembers = addedMembers.filter((member) => {
      return member !== user
    })

    setUsersToAdd(usersToAdd.filter((member) => {
      return member !== user
    }))

    setAddedMembers(newMembers)
  }

  async function handleSubmit(){
    usersToAdd.map(async (user) =>{
      await addToGroup(user);
      await fetch(`${API_URL}/message/group/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId: String(localStorage.getItem('email')), name, userEmail: user.email }),
      })
      // console.log(user.name, user.email)
    })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {addedMembers.map((user) => {
          return (
            <span className={styles.user}>
              <button
                className={styles.removeMemberButton}
                onClick={() => removeMemberToGroup(user)}
              >
                x
              </button>
              <img src={user.profilePicUrl} />
              <p>{user.name}</p>
            </span>
          )
        })}
      </header>
      <div className={styles.userList}>
        {users.map((user, index) => {
          if (!addedMembers.includes(user)) {
            return (
              <button
                className={styles.user}
                onClick={() => addMemberToGroup(user)} key={index}
              >
                <img src={user.profilePicUrl} />
                <p>{user.name}</p>
              </button>
            )
          }
        })}
      </div>
      <button onClick={handleSubmit} className={styles.submitButton}>Concluir</button>
    </div>
  )
}
