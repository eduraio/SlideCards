import './global.css'

import { insertData } from './api/connection'

import { useState} from 'react';

const defaultOption = [
  {
    name: "Iniciado",
    status: false
  },
  {
    name: "Produzido",
    status: false
  },
  {
    name: "Revisado",
    status: false
  },

]


export function App() {

  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ options, setOptions ] = useState(defaultOption)
  const [ selected, setSelected ] = useState('Planejamento')
  const [ tags, setTags ] = useState<string[]>([])
  const [ newTag, setNewTag] = useState('')

  function handleNewOption(e:any) {

    const newOptionsArray = options.map(option => {
      if (option.name === e.target.name)
        option.status = !option.status
        
        return option
    })
    console.log(newOptionsArray)
    setOptions(newOptionsArray)
  }

  function handleTags() {
    if (newTag === '') return
      setTags([...tags, newTag])
      setNewTag('')
  }

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

    const newOptionsArray = options.map(option => {
        option.status = false
        return option
    })
    setOptions(newOptionsArray)
  }

  async function createNewCard(e:any) {
    e.preventDefault()
    await insertData({name, email, description, options, selected, tags})
    resetStats()

  }

  return (
    <div className="container">
      <div className="header">
        <h1>SlideCards</h1>
        <span>Insira novas informações na sua lista do Trello.</span>

        <br/>
        <br/>
        <span>Nome: {name}</span>
        <br/>
        <span>E-mail: {email}</span>
        <br/>
        <span>descrição: {description}</span>
        <br/>
        <span>Opções: {options[0].name} {String(options[0].status)}</span>
        <br/>
        <span>Selecionado: {selected}</span>
        <br/>
        <span>Tags: {tags.join(' ')}</span>
        <br/>
        <span>Nova TAG: {newTag}</span>


      </div>

      <form action="" onSubmit={(e) => createNewCard(e)}>

        <div className="right-content">

          <span>Nome</span>
          <input type="text" value={name} placeholder="Nome" required onChange={(e) => setName(e.target.value)}/>

          <span>E-mail</span>
          <input type="email" value={email} placeholder="E-mail" required onChange={(e) => setEmail(e.target.value)}/>
          <textarea placeholder="Escreva alguma coisa." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

        </div>

        <div className="left-content">

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
          
          <span>Status</span>
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
          <button className='submit-button'>Enviar</button>

        </div>
      </form>
    </div>
  );
}
