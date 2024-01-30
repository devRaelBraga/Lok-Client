import { useState } from 'react'
import styles from './GroupRegister.module.css'
import { useCreateGroupHook } from './abc'
import Logo from './assets/logo.png'
import { API_URL } from './main'
import { useNavigate } from 'react-router-dom'



export default function GroupRegister() {
  const [name, setName] = useState('')
  const [file, setFile] = useState<any>()
  
  const navigate = useNavigate()

  async function handleSubmit(e:any){
    let photo;
    console.log(name)
    e.preventDefault()
    await useCreateGroupHook(String(localStorage.getItem('pIdentityKey')), name)

    var reader = new FileReader();
    // console.log(file)
    reader.readAsDataURL(file);
    reader.onloadend = async function() {
      photo = reader.result
      await fetch(`${API_URL}/message/group`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({adminId: String(localStorage.getItem('email')), name, groupPic: photo })
        }).then((response) => response.json()).then((data) => {
            setTimeout(() => {
              navigate('/chat')
            }, 1500)
        }).catch((err) => {
          alert(err);
        })
    }

    // Navigate
  }

  return (
    <div className={styles.container}>
      <img src={Logo} className={styles.logo} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="file" accept='image/*' onChange={(e) => setFile(e.target.files![0])}/>
        <input type='text' placeholder='Nome do Grupo' value={name} onChange={(e) => setName(e.target.value)}/>
        <button type='submit'>Criar Grupo</button>
      </form>
    </div>
  )
}
