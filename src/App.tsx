import { useState, useEffect } from 'react'
// import './App.css'
import { useGenerateKeyHook, useSharedKeyHook } from './hooks/encryptionHook';
import WebSocketComponent from './websocket';

function App() {
  const [onChange, setOnchange] = useState('');
  const [onChange2, setOnchange2] = useState('');
  const [onChange3, setOnchange3] = useState('');

  
  const data = useGenerateKeyHook();
  const shared:any = useSharedKeyHook(data.key, onChange);

  return (
    <>
      <p>{data.text}</p>
      <input type="text" onChange={(e) => setOnchange(e.target.value) } value={onChange}/>
      <p>nome</p>
      <input type="text" onChange={(e) => setOnchange2(e.target.value) } value={onChange2}/>
      <p>nome pra enviar</p>
      <input type="text" onChange={(e) => setOnchange3(e.target.value) } value={onChange3}/>

      {onChange2 && onChange3 && <WebSocketComponent shared={shared} topic={onChange2} destino={onChange3}></WebSocketComponent>}

    </>
  )
}

export default App
