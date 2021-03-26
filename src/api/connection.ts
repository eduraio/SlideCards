import axios from 'axios'

const baseURL = 'https://api.trello.com/1/'
const key= 'd76de3efaf05fb79eeedaa6eb0a19d94'
const token= '0286fa41ae17503800eb868de0f30c02d1f722dd2d878c0185c35a75741986e9'
const id = '605bf8c02b61d86f86c08191'

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

//'https://api.trello.com/1/labels?key=&token=&name={name}&color={color}&idBoard={idBoard}'

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

async function createList(name:string) {
    const response = await axios.post(`${baseURL}boards/${id}/lists?key=${key}&token=${token}&name=${name}`).then( data => {
        return data.data
    })

    return response.id
}

async function createCard(props:insertDataProps, listId:string) {

    const cardName = `${props.email} ( ${props.selected} )`
    const response = await axios.post(`${baseURL}cards?key=${key}&token=${token}&name=${cardName}&desc=${props.description}&idList=${listId}`).then( data => {
        return data.data
    })

    return response.id
}

async function addLabelToCard(cardId:string, labels:string[]) {

    labels.forEach(async label => {
        await axios.post(`${baseURL}cards/${cardId}/idLabels?key=${key}&token=${token}&value=${label}`).then( data => {})
    })
}

async function createCheckList(cardId:string) {

    const response = await axios.post(`${baseURL}checklists?key=${key}&token=${token}&idCard=${cardId}`).then( data => {
        return data.data
    })

    return response.id
}

//checklists/{id}/checkItems?key=&token=&name={name}&checked'

async function addChecklistItens(checklistId:string, options:optionsProps[]) {
    options.forEach(async op => {
        console.log(op)
        await axios.post(`${baseURL}checklists/${checklistId}/checkItems?key=${key}&token=${token}&name=${op.name}&checked=${op.status}&pos=bottom`).then( data => {})
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


    

}