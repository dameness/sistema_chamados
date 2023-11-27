import { FiX } from 'react-icons/fi'
import './index.css'


export default function Modal({conteudo, close}){



    return(
        <div className='modal'>
            <div className='container'>
                <button className='close'
                //função de fechar modal passada por propriedades!!!!
                onClick={close}>
                    <FiX size={25} color='#fff'/>
                    Voltar
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>

                    <div className='row'>
                        <span>
                            Cliente: <i>{conteudo.cliente}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Assunto: <i>{conteudo.assunto}</i>
                        </span>

                        <span>
                            Cadastrado em: <i>{conteudo.createdFormat}</i>
                        </span>

                    </div>

                    <div className='row'>
                        <span>
                            Status: 
                            <i
                                style=
                                {{ backgroundColor: 

                                  conteudo.status==='Aberto' ? '#5cb85c' 
                                : conteudo.status==='Atendido'? '#999' 
                                : '#c4b600', 

                                borderRadius: '5px',
                                color: '#fff',
                                marginLeft: '0.6em'
                                }}
                            >
                                {conteudo.status}
                            </i>
                        </span>

                    </div>

                    {conteudo.complemento && (
                        <>
                            <h3>Complemento</h3>

                            <p>
                                {conteudo.complemento}
                            </p>
                        </>
                    )}


                </main>
            </div>
        </div>
    )
}