import '../styles/newCard.css'

interface optionsProps {
    name:string,
    status: boolean
}
interface cardProps {
    name:string,
    email:string,
    description:string,
    options:optionsProps[],
    selected:string,
    tags:string[]
}

export function NewCardModal(props:cardProps) {
    return (
        <div className="preview">

        <h3>{props.name === '' ? 'Nome' : props.name} ( Preview )</h3>

        <div>

          <div>{props.email === '' ? 'E-mail' : props.email} ( {props.selected} )</div>

          <div className="prEmail">{props.description === '' ? 'Descrição' : props.description}</div>

          <div className="prChecklist">

            <div>
              <input type="checkbox" id="Iniciado" checked={props.options[0].status} name="Iniciado" value="Iniciado" disabled/>
              <label htmlFor="Iniciado">Iniciado</label>
            </div>


            <div>
              <input type="checkbox" id="Produzido" disabled checked={props.options[1].status}/>
              <label htmlFor="Produzido">Produzido</label>
            </div>

            <div>
              <input type="checkbox"  id="Revisado" disabled checked={props.options[2].status}/>
              <label htmlFor="Revisado">Revisado</label>
            </div>

          </div>

          <div className="prTags">
            Tags
            <div className="customTags">
              {props.tags.map(tag => {
                return <label  key={tag} className="prTagLabel" aria-disabled >{tag}</label>
              })}
            </div>

          </div>
        </div>
      </div>
    )
}