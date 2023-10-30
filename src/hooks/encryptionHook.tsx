import { useEffect, useState } from 'react'

export function useGetKeyHook(receiverKey: any, setKey:any) {
    const [privateKey, setPrivateKey] = useState<any>('');
    const [publicKey, setPublicKey] = useState<any>('');
    const [sharedKey, setSharedKey] = useState<any>('');
    


    useEffect(() => {
        
    }, [receiverKey]);
    
    
    return {public: publicKey, private: privateKey, sharedKey: sharedKey}
};

export function useGenerateKeyHook() {
    const [data, setData] = useState<any>();
    const [dataHex, setDataHex] = useState('');
    const [privateHex, setPrivateHex] = useState('');

   

    useEffect(() => {
    async function generate(){
        
    }

    generate();
    }, []);

    return {key: data, text: dataHex, private: privateHex};
};

// export function useSharedKeyHook(privateKey:any, publicKey:any, setSharedKey:any) {
//     const [data, setData] = useState<CryptoKey>();


//     useEffect(() => {

//     }, [publicKey])

//     // throw new Error('n sei')

// }