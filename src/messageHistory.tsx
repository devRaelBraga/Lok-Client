

type message = {
    content: string,
    senderEmail: string,
    receiverEmail: string,
    group: string|false
}

type messageHistory = message[]

export function storeMessage(content: string, senderEmail: string, receiverEmail: string, group: string|false = false) {

    const a : message = {
        content,
        senderEmail,
        receiverEmail,
        group
    }

    let messageHistory: messageHistory = JSON.parse(String(localStorage.getItem('messageHistory')))

    if(!messageHistory) {
        messageHistory = []
        console.log('era null')
    }

    messageHistory.push(a)



    localStorage.setItem('messageHistory', JSON.stringify(messageHistory))
}

export function getHistory(email1: string, email2: string, group:string|undefined) {
    const history: messageHistory = JSON.parse(String(localStorage.getItem('messageHistory')))

    if(group){
        // console.log(group);
        return history.filter(message => message.group == group)
    }

    let a = history.filter(message => message.senderEmail == email1 && message.receiverEmail == email2  && !message.group 
        || message.senderEmail == email2 && message.receiverEmail == email1 && !message.group)
    

    return a
}