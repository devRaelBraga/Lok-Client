import { useState } from 'react'
import styles from './GroupRegister.module.css'
import { useCreateGroupHook } from './abc'
import Logo from './assets/logo.png'
import { API_URL } from './main'

export default function GroupRegister() {
  const [name, setName] = useState('')


  async function handleSubmit(e:any){
    console.log(name)
    e.preventDefault()
    await useCreateGroupHook(String(localStorage.getItem('pIdentityKey')), name)

    await fetch(`${API_URL}/message/group`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({adminId: String(localStorage.getItem('email')), name})
        }).then((response) => response.json()).then((data) => {
            console.log(data);
        })
  }

  return (
    <div className={styles.container}>
      <img src={Logo} className={styles.logo} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type='text' placeholder='Nome do Grupo' value={name} onChange={(e) => setName(e.target.value)}/>
        <button type='submit'>Criar Grupo</button>
      </form>
    </div>
  )
}
