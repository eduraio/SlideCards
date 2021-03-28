import './styles/global.css'
import { insertData } from './api/connection'
import {useState} from 'react';

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
  const [ selected, setSelected ] = useState('Selecione...')
  const [ tags, setTags ] = useState<string[]>([])

  // estados de verificação
  const [ newTag, setNewTag] = useState('')
  const [ invalidName, setInvalidName] = useState('')
  const [ invalidEmail, setInvalidEmail] = useState('')
  const [ invalidSelected, setInvalidSelected] = useState('')
  const [ processing, setProcessing] = useState('Confirmar envio?')

  // funções que alteram o estado

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

  function changeSelected() {
    const nameElement = window.document.getElementById("selecId")!.getElementsByTagName("option")!

    if (nameElement !== null) {
      for (var i = 0; i < nameElement.length; i++) {
        if (nameElement[i].value.toLowerCase() === "selecione...") {
          nameElement[i].disabled = false ;
          setSelected('Selecione...')
          nameElement[i].disabled = true ;
        }
      }
    }
    
  }

  function resetStats() {
    setName('')
    setEmail('')
    setDescription('')
    setTags([])
    setNewTag('')
    setProcessing('Confirmar envio?')

    changeSelected()

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
        nameElement.style.borderBottom = "1px solid red"

      setTimeout(() => { nameElement.style.borderBottom = "1px solid #202020"}, 5000);
      setInvalidName('( Este campo é obrigatório )')
      return false
    }

    const regexEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i
    const validEmail = regexEmail.test(email)

    if (email === '') {
      const nameElement = window.document.getElementById("emailInput")!

      if (nameElement !== null)
        nameElement.style.borderBottom = "1px solid red"
      
      setTimeout(() => { nameElement.style.borderBottom = "1px solid #202020" }, 5000);
      setInvalidEmail('( Este campo é obrigatório )')
      return false
    } 
    
    else if (!validEmail) {
        const nameElement = window.document.getElementById("emailInput")!

        if (nameElement !== null)
          nameElement.style.borderBottom = "1px solid red"
        
        setTimeout(() => { nameElement.style.borderBottom = "1px solid #202020" }, 5000);
        setInvalidEmail('( E-mail inválido )')
        return false
    }

    if ( selected === 'Selecione...') {
      const nameElement = window.document.getElementById("selecId")!

      if (nameElement !== null)
          nameElement.style.borderBottom = "1px solid red"
        
        setTimeout(() => { nameElement.style.borderBottom = "1px solid #202020" }, 5000);
        setInvalidSelected('( Selecione uma opção )')

        return false
    }
    return true
  }

  // função que aciona conexão caso envio seja confirmado
  async function confirmed() {
    setProcessing('Enviando dados...')
    await insertData({name, email, description, options, selected, tags})
    resetStats()
    hideButtons()
  }

  // função que vokta o botao enviar caso seja cancelado o envio
  function denied() {
    hideButtons()
  }

  // função que mostra os botoes de confirmar cancelar quando pressionado botao enviar
  function showButtons() {
    const envButton = window.document.getElementById("envButton")!
    const confirmation  = window.document.getElementById("confirmation")!

    envButton.className= "disableButton"
    confirmation.style.display = "block"
  }

  // função que esconde os botoes de confirmar cancelar quando pressionado botao enviar
  function hideButtons() {
    const envButton = window.document.getElementById("envButton")!
    const confirmation  = window.document.getElementById("confirmation")!

    envButton.className = "envButton"
    confirmation.style.display = "none"
  }

  // função que valida campos antes de tentar crar novo card
  async function createNewCard(e:any) {
    e.preventDefault()

    const validateFields = checkFields()

    if (!validateFields) return
    showButtons()

  }

  return (
    <div className="container">
      <form action="" noValidate onSubmit={(e) => createNewCard(e)}>
        <div className="preview">

          {/* Estilização parte superior */}
          <div className="title">
            <h1>SlideCards</h1>
            <span>Insira novas informações na <a target="_blanck" href="https://trello.com/b/XWaXCkAj/slidecards">lista do Trello.</a></span>
          </div>

          {/* Estilização meio */}
          <div className="content">

            <div className="errorMessage">
              <span>{invalidName}</span>
              <span>{invalidEmail}</span>
            </div>

            <div className="inputText">
              <input type="text" value={name} id="nameInput" placeholder="Nome" onChange={(e) => {
                setName(e.target.value)
                setInvalidName('')
              }}/> 
              <input type="email" value={email} id="emailInput" placeholder="E-mail"onChange={(e) => {
                setEmail(e.target.value)
                setInvalidEmail('')
              }}/>
            </div>

            <div className="tags">
              <div>
                <span>Tags ( Clique para remover )</span>
              </div>
              <div>
                <div className="customTags">
                  {tags.map(tag => {
                    return <label key={tag} className="TagLabel" onClick={(e) => handleRemoveTag(e)}>{tag}</label>
                  })}
                  <div>
                    <input type="text" value={newTag} maxLength={25} placeholder="Add TAG" onChange={(e) => setNewTag(e.target.value)}/>
                    <input type="button" value='+' onClick={(e) => handleTags()} />
                  </div>
                </div>
              </div>

            </div>

            <span className="progessSpan">Progresso</span>

            <div className="checklist">
              <div>
                <input type="checkbox" id="Iniciado" checked={options[0].status} name="Iniciado" onChange={(e) => handleNewOption(e)}/>
                <label htmlFor="Iniciado">Iniciado</label>
              </div>


              <div>
                <input type="checkbox" id="Produzido" checked={options[1].status} name="Produzido"  onChange={(e) => handleNewOption(e)} />
                <label htmlFor="Produzido">Produzido</label>
              </div>

              <div>
                <input type="checkbox"  id="Revisado" checked={options[2].status} name="Revisado"  onChange={(e) => handleNewOption(e)}/>
                <label htmlFor="Revisado">Revisado</label>
              </div>
            </div>

            <div className="description">
              <span>Descrição</span>
              <textarea value={description} placeholder="Escreva alguma coisa." onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="errorMessage">
            <span></span>
              <span>{invalidSelected}</span>
            </div>
            <div className="selection">
              <span>Status</span>
              <select id="selecId" name="option" value={selected} onChange={(e) => {
                setSelected(e.target.value)
                setInvalidSelected('')
              }}>
                <option value="Selecione..." disabled >Selecione...</option>
                <option value="Planejamento">Planejamento</option>
                <option value="Produção">Produção</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

          </div>

          {/* Estilização parte inferior */}
          <div className="bottom">
            <button className="envButton" id="envButton">Enviar</button>
            <div id="confirmation" className="confirmation">
              <span id="spanConfirmation">{processing}</span>
              <div>
                <input type="button" value="Cancelar" onClick={(e) => denied()} />
                <input type="button" value="Confirmar" onClick={(e) => confirmed()}/>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
