import './index.css'

import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const listRef = collection(db, "customers")

export default function New(){

    const {user} = useContext(AuthContext);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {

        async function loadCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then( (snapshot) => {
                   let lista = [];
                   
                   snapshot.forEach((doc) => {
                    lista.push({
                        id:doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                   })

                   if(snapshot.docs.size === 0){
                     console.log("Nenhuma empresa encontrada!")
                     setLoadCustomer(false);
                     setCustomers([ { id:'1', nomeFantasia: 'Freela'}])
                     return;
                   }

                   //console.log(lista);
                   setCustomers(lista);
                   setLoadCustomer(false);

                   if(id){
                    loadId(lista);
                   }
            })
            .catch(error => {
                console.error("Erro ao buscar os clientes -", error)
                setLoadCustomer(false);
                setCustomers([ { id:'1', nomeFantasia: 'Freela'}])
            })
        }

        loadCustomers();

    }, [id])

    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [loadCustomer, setLoadCustomer] = useState(true);
    const [idCustomer, setIdCustomer] = useState(false)

    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    
    async function loadId(lista){
        const docRef = doc(db, "chamados", id);
        await getDoc(docRef)
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item =>item.id === snapshot.data().clienteId)
            setCustomerSelected(index);
            setIdCustomer(true)

        })
        .catch((error)=>{
            console.error(error);
            setIdCustomer(false);
        })
    }

    function handleOptionChange(e){
        setStatus(e.target.value);
    }

    function handleSelectChange(e){
        setAssunto(e.target.value);
    }

    function handleCustomerChange(e){
        setCustomerSelected(e.target.value);
    }

    async function handleRegister(e){
        e.preventDefault();

        if(idCustomer){ //edicao
            const docRef = doc(db, "chamados", id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
            })
            .then(() => {
                toast.info("Atualizado com sucesso!")
                setCustomerSelected(0);
                setComplemento('')
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error(error);
                toast.error("Erro ao atualizar!")
            })


            return;
        }

        await addDoc(collection(db, "chamados"), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
        .then( () => {
            toast.success("Chamado registrado!")
            setComplemento('')
            setCustomerSelected(0)
        })
        .catch( (error) => {
            console.error(error)
            toast.error("Erro ao registrar!")
        })
    }


    return(
        <div>
            <Header/>

            <div className='content'>
                <Title title = { idCustomer ? 'Editando chamado' : 'Novo chamado'}>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile'
                          onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type='text' disabled={true} value="Carregando..." />
                            ) : (
                                <select value={customerSelected} onChange={handleCustomerChange}>
                                    {
                                        customers.map((customer, index) =>   { 
                                            //return é necessário se não for em uma linha só
                                           return(
                                             <option key={index} value={index}>{customer.nomeFantasia}</option>
                                           )
                                        })
                                        
                                       
                                    }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleSelectChange}>
                            <option value={"Suporte"}>Suporte</option>
                            <option value={"Visita Técnica"}>Visita Técnica</option>
                            <option value={"Financeiro"}>Financeiro</option>
                        </select>
                        
                        <label>Status</label>
                        <div className='status'>
                            <input 
                                type='radio'
                                name='radio'
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status==='Aberto'}
                            />
                            <span>Em aberto</span>

                            <input 
                                type='radio'
                                name='radio'
                                value='Progresso'
                                onChange={handleOptionChange}
                                checked={status==='Progresso'}
                            />
                            <span>Em progresso</span>

                            <input 
                                type='radio'
                                name='radio'
                                value='Atendido'
                                onChange={handleOptionChange}
                                checked={status==='Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                            <textarea
                            value={complemento}
                            onChange={e => setComplemento(e.target.value)}
                            type="text"
                            placeholder='Descreva seu problema (Opcional)'
                         />

                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}