
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiUser } from 'react-icons/fi'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'
/**
 classes content, container, formprofile
 estão definidas em outros css pois são os mesmo
estilos
 */
export default function Customers(){

    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleRegister(e){
        e.preventDefault();

        if(nome !== '' && cnpj !== '' && endereco !== ''){
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco
            })
            .then( () => {
                setNome('')
                setCnpj('')
                setEndereco('')
                toast.success("Empresa cadastrada!")
            })
            .catch((error)=>{
                console.error(error);
                toast.error("Erro ao fazer o cadastro");
            })
        }else{
            toast.warn("Preencha todos os campos!")
        }
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title title = 'Clientes'>
                    <FiUser size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile'
                    onSubmit={handleRegister}>

                        <label>Nome fantasia</label>
                        <input
                            type='text'
                            placeholder='Nome da empresa'
                            value={nome}
                            onChange={
                                e => setNome(e.target.value)
                            }
                        />

                        <label>CNPJ</label>
                        <input
                            type='text'
                            placeholder='Digite o CNPJ'
                            value={cnpj}
                            onChange={
                                e => setCnpj(e.target.value)
                            }
                        />

                        <label>Endereço</label>
                        <input
                            type='text'
                            placeholder='Digite o endereço'
                            value={endereco}
                            onChange={
                                e => setEndereco(e.target.value)
                            }
                        />

                        <button type='submit'>
                            Salvar
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}                                                            