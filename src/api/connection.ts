import axios from 'axios'

const baseURL = 'https://api.trello.com/1/'

const key= process.env.REACT_APP_KEY
const token= process.env.REACT_APP_TOKEN
const id = process.env.REACT_APP_ID

interface optionsProps {
    name:string,
    status: boolean
}
interface insertDataProps {
    name:string,
    email:string,
    description:string,
    options:optionsProps[],
    selected:string,
    tags:string[]
}

// Função que cria novas labels na lista.
async function createLabels(labels:string[]) {

    if (labels.length === 0) return []

    const labelsIds:string[] = []

    for (let i = 0; i < labels.length; i++) {
        const response = await axios.post(`${baseURL}labels?key=${key}&token=${token}&name=${labels[i]}&color=null&idBoard=${id}`).then( data => {
            return data.data
        })
        labelsIds.push(response.id)
    }

    return labelsIds
}

// Função que cria uma nova lista
async function createList(name:string) {
    const response = await axios.post(`${baseURL}boards/${id}/lists?key=${key}&token=${token}&name=${name}`).then( data => {
        return data.data
    })

    return response.id
}

// Função que cria um novo card na lista
async function createCard(props:insertDataProps, listId:string) {

    const cardName = `${props.email} ( ${props.selected} )`
    const response = await axios.post(`${baseURL}cards?key=${key}&token=${token}&name=${cardName}&desc=${props.description}&idList=${listId}`).then( data => {
        return data.data
    })

    return response.id
}

// Função que adiciona as labels criadas no card.

async function addLabelToCard(cardId:string, labels:string[]) {

    for (let i = 0; i < labels.length; i++) {
        await axios.post(`${baseURL}cards/${cardId}/idLabels?key=${key}&token=${token}&value=${labels[i]}`).then( data => {})
    } 
}


// Função que cria o checklist
async function createCheckList(cardId:string) {

    const response = await axios.post(`${baseURL}checklists?key=${key}&token=${token}&idCard=${cardId}`).then( data => {
        return data.data
    })

    return response.id
}

// Função que adiciona o checklist criado no card
async function addChecklistItens(checklistId:string, options:optionsProps[]) {
    options.forEach(async op => {
        await axios.post(`${baseURL}checklists/${checklistId}/checkItems?key=${key}&token=${token}&name=${op.name}&checked=${op.status}`).then( data => {})
    })
}

export async function insertData(props:insertDataProps) {

    const listId = await (createList(props.name))
    const labels = await createLabels(props.tags)
    const cardId = await createCard(props, listId)

    if (labels.length !== 0)
        await addLabelToCard(cardId, labels)
    const checklistId = await createCheckList(cardId)
    await addChecklistItens(checklistId, props.options)

    return true


    

}