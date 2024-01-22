import styles from './GroupAddMembers.module.css'
import { useState, useEffect } from 'react'
import { API_URL } from './main'

export default function AddMembersToGroup() {
  const [addedMembers, setAddedMembers] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    async function getUsers() {
      await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: String(localStorage.getItem('email')) }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setUsers(data)
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
              <button onClick={() => removeMemberToGroup(user)}>x</button>
              <img src={user.profilePicUrl} />
              <p>{user.name}</p>
            </span>
          )
        })}
      </header>
      <div className={styles.userList}>
        {users.map((user) => {
          if (!addedMembers.includes(user)) {
            return (
              <button
                className={styles.user}
                onClick={() => addMemberToGroup(user)}
              >
                <img src={user.profilePicUrl} />
                <p>{user.name}</p>
              </button>
            )
          }
        })}
      </div>
      <button className={styles.submitButton}>Concluir</button>
    </div>
  )
}
