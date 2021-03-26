import './styles/global.css'
import { insertData } from './api/connection'
import {useState} from 'react';

import { NewCardModal } from './components/newCard'

// Array para inicializar estado dos checkbox
const defaultOption = [
  {
    name: "Iniciado",
    status: false
  },
  {
    name: "Produzido",
    status: false,
  },
  {
    name: "Revisado",
    status: false
  },

]


export function App() {

  // estados finais
  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ options, setOptions ] = useState(defaultOption)
  const [ selected, setSelected ] = useState('Planejamento')
  const [ tags, setTags ] = useState<string[]>([])

  // estados de verificação
  const [ newTag, setNewTag] = useState('')
  const [ invalidName, setInvalidName] = useState('*')
  const [ invalidEmail, setInvalidEmail] = useState('*')
  const [ processing, setProcessing] = useState('')

  function handleNewOption(e:any) {

    // Inverte checked status dos checkbox
    const newOptionsArray = options.map(option => {
      if (option.name === e.target.name)
        option.status = !option.status
        
        return option
    })
    setOptions(newOptionsArray)
  }

  // adiciona novas Tags ao array, ignorando se estiver vazio ou repetido
  function handleTags() {
    if (newTag === '') return
    if (tags.includes(newTag)) return

    setTags([...tags, newTag])
    setNewTag('')
  }

  // remove tag ao clicar nela
  function handleRemoveTag(e:any) {
    const newTagsArray = tags.filter(tag => tag !== e.target.firstChild.data)
    setTags(newTagsArray)
  }

  function resetStats() {
    setName('')
    setEmail('')
    setDescription('')
    setSelected('Planejamento')
    setTags([])
    setNewTag('')
    setProcessing('')

    const newOptionsArray = options.map(option => {
        option.status = false
        return option
    })
    setOptions(newOptionsArray)
  }

  // validação dos campos obrigatorios ( Nome e email ) e verificação de formato de e-mail usando regex
  function checkFields() {

    if (name === '') {
      const nameElement = window.document.getElementById("nameInput")!

      if (nameElement !== null)
        nameElement.style.border = "1px solid red"

      setTimeout(() => { nameElement.style.border = "1px solid #202020"}, 5000);
      setInvalidName('( Este campo é obrigatório )')
      return false
    }

    const regexEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
    const validEmail = regexEmail.test(email)

    if (email === '') {
      const nameElement = window.document.getElementById("emailInput")!

      if (nameElement !== null)
        nameElement.style.border = "1px solid red"
      
      setTimeout(() => { nameElement.style.border = "1px solid #202020" }, 5000);
      setInvalidEmail('( Este campo é obrigatório )')
      return false
    } 
    
    else if (!validEmail) {
        const nameElement = window.document.getElementById("emailInput")!

        if (nameElement !== null)
          nameElement.style.border = "1px solid red"
        
        setTimeout(() => { nameElement.style.border = "1px solid #202020" }, 5000);
        setInvalidEmail('( E-mail inváido )')
        return false
    }
    return true
  }

  async function createNewCard(e:any) {
    setProcessing('Enviando dados...')
    e.preventDefault()

    const validateFields = checkFields()

    if (!validateFields){
      setProcessing('Por favor, verifique os campos obrigatórios.')
      setTimeout(() => { setProcessing('') }, 3000);
      return
    }

    await insertData({name, email, description, options, selected, tags})
    const nameElement = window.document.getElementById("processStatus")!

    if (nameElement !== null)
        nameElement.style.color = "#00ff00"
    setProcessing('Sucesso!')
    setTimeout(() => {
      if (nameElement !== null)
        nameElement.style.color = "#202020"
      resetStats()
    }, 1000);
    
  }

  return (
    <div className="container">

      <div className="header">
        <div>
          <h1>SlideCards</h1>
          <span>Insira novas informações na <a target="_blanck" href="https://trello.com/b/XWaXCkAj/slidecards">lista do Trello.</a></span>
        </div>

        <div className="normalPreview">
            <NewCardModal name={name} email={email} description={description} selected={selected} options={options} tags={tags} />
          </div>
      </div>

      <form action="" noValidate onSubmit={(e) => createNewCard(e)}>

        <div className="left-content">

          <span data-end={invalidName} >Nome </span>

          <input type="text" id="nameInput" value={name} placeholder="Nome" onChange={(e) => {
            setName(e.target.value)
            setInvalidName('*')
          }}/>

          <span data-end={invalidEmail}>E-mail </span>

          <input id="emailInput" type="email" value={email} placeholder="E-mail" onChange={(e) => {
            setEmail(e.target.value)
            setInvalidEmail('*')
          }}/>

          <span>Descrição</span>

          <textarea placeholder="Escreva alguma coisa." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

        </div>

        <div className="right-content">

          <div className="checkboxs">

            <div>
              <input type="checkbox" id="Iniciado" checked={options[0].status} name="Iniciado" value="Iniciado" onChange={(e) => handleNewOption(e)}/>
              <label htmlFor="Iniciado">Iniciado</label>
            </div>


            <div>
              <input type="checkbox" id="Produzido" name="Produzido" checked={options[1].status} value="Produzido" onChange={(e) => handleNewOption(e)}/>
              <label htmlFor="Produzido">Produzido</label>
            </div>

            <div>
              <input type="checkbox"  id="Revisado" name="Revisado" checked={options[2].status} value="Revisado" onChange={(e) => handleNewOption(e)}/>
              <label htmlFor="Revisado">Revisado</label>
            </div>
          </div>
          
          <span>Status ( Selecione )</span>
          <select name="option" value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="Planejamento">Planejamento</option>
            <option value="Produção">Produção</option>
            <option value="Finalizado">Finalizado</option>
          </select>


          <span>Tags ( Clique para remover )</span>
          <div className="tags">
            <input type="text" value={newTag} placeholder="Adicionar nova TAG" onChange={(e) => setNewTag(e.target.value)}/>
            <input type="button" value='+' onClick={(e) => handleTags()}/>
            <div>
              <div className="customTags">
                {tags.map(tag => {
                  return <label  key={tag} className="tagLabel" onClick={(e) => handleRemoveTag(e)} >{tag}</label>
                })}
              </div>
            </div>
          </div>
          <div className="mbPreview">
            <NewCardModal name={name} email={email} description={description} selected={selected} options={options} tags={tags} />
          </div>
          <button className='submit-button'>Enviar</button>
          <span id="processStatus">{processing}</span>

        </div>
      </form>
    </div>
  );
}
