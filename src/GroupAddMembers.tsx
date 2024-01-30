import styles from './GroupAddMembers.module.css'
import { useState, useEffect } from 'react'
import { API_URL } from './main'
import { useParams } from 'react-router-dom'

export default function AddMembersToGroup() {
  const [addedMembers, setAddedMembers] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const { id } = useParams();

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
  }

  function removeMemberToGroup(user: any) {
    const newMembers = addedMembers.filter((member) => {
      return member !== user
    })

    setAddedMembers(newMembers)
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
      <button onClick={() => console.log(id)} className={styles.submitButton}>Concluir</button>
    </div>
  )
}
