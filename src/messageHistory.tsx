

type message = {
    content: string,
    senderEmail: string,
    receiverEmail: string,
}

type messageHistory = message[]

export function storeMessage(content: string, senderEmail: string, receiverEmail: string) {

    const a : message = {
        content,
        senderEmail,
        receiverEmail
    }

    let messageHistory: messageHistory = JSON.parse(String(localStorage.getItem('messageHistory')))

    if(!messageHistory) {
        messageHistory = []
        console.log('era null')
    }

    messageHistory.push(a)



    localStorage.setItem('messageHistory', JSON.stringify(messageHistory))
}

export function getHistory(email1: string, email2: string) {
    const history: messageHistory = JSON.parse(String(localStorage.getItem('messageHistory')))


    let a = history.filter(message => message.senderEmail == email1 && message.receiverEmail == email2 
        || message.senderEmail == email2 && message.receiverEmail == email1)

    return a
}