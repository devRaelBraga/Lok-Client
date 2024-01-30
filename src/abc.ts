

export async function useCreateGroupHook(privateKey: string, name: string){
    const groupKey = await crypto.subtle.generateKey({
    name: 'ECDH',
    namedCurve: 'P-256'
    }, true, ['deriveKey'])

    let privateRawKey: any = await crypto.subtle.importKey('pkcs8', hexToArrayBuffer(privateKey), {
        name: 'ECDH',
        namedCurve: 'P-256'
    }, true, ['deriveKey']).catch(err => console.log('erro: ', err));

    try {
        const sharedkey = await crypto.subtle.deriveKey(
            {
                name: 'ECDH',
                public: groupKey.publicKey,
            },
            privateRawKey,
            {
                name: 'AES-GCM',
                length: 256
            },
            true,
            ['encrypt', 'decrypt']
            );

            const shared = await crypto.subtle.exportKey('raw', sharedkey)

            console.log(arrayBufferToHex(shared))

            localStorage.setItem('group:' + name, arrayBufferToHex(shared))
        
            return(sharedkey);

    } catch (error) {
        console.log(error);
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


        function hexToArrayBuffer(hexString:string) {
            const buffer = new ArrayBuffer(hexString.length / 2);
            const view = new DataView(buffer);
          
            for (let i = 0; i < hexString.length; i += 2) {
              const byteValue = parseInt(hexString.substr(i, 2), 16);
              view.setUint8(i / 2, byteValue);
            }
    
            return buffer;
        }


}