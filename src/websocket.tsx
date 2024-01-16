import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { API_URL } from './main'

function WebSocketComponent({topic, destino, shared}:{topic:string, destino:string, shared:CryptoKey}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(`${API_URL}`);

    newSocket.on('connect', () => {
      console.log('Conexão estabelecida');
    });

    newSocket.on(topic, async (message: number[]) => {
      // Lide com mensagens recebidas do servidor aqui
      const textDecoder =  new TextDecoder();
      const ivBytes = new Uint8Array(12);
      const ArrayBuffer = new Uint8Array(message).buffer;

      const buffer = await crypto.subtle.decrypt({
          name: 'AES-GCM',
          iv: ivBytes
        }, shared, ArrayBuffer)
      
      const decoded = textDecoder.decode(buffer);
      setMessages((prevMessages) => [...prevMessages, decoded]);
    });

    newSocket.on('disconnect', () => {
      console.log('Conexão fechada');
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

  const sendMessage = async () => {
    console.log({topic, destino});
    const textEconder =  new TextEncoder();
    const ivBytes = new Uint8Array(12);
    
    const buffer = await crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv: ivBytes
    }, shared, textEconder.encode(messageInput))

    const byteArray = Array.from(new Uint8Array(buffer));

    const message = JSON.stringify({
      message: byteArray,
      receiver: destino
    })

    if (socket) {
      socket.emit('message', message);
    }
    // setMessages((prevMessages) => [...prevMessages, messageInput])
    setMessageInput('');
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default WebSocketComponent;
