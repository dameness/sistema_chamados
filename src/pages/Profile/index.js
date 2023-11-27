import './index.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import { AuthContext } from '../../contexts/auth'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { db, storage } from '../../services/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'


export default function Profile(){

    //class content está na estilizacao do header! para que qualquer
    //classname content nas partes que forem usar o header tenham esses
    //estilos
    const { user, storageUser, setUser, logout } = useContext(AuthContext);
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)

                                            //se tiver user, senao, null
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] = useState(null);

    function handleFile(e){
        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type == 'image/png'){
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            }else{
                toast.warn("Envie uma imagem do tipo PNG ou JPEG!")
                setImageAvatar(null)
                return
            }
        }
    }

    async function  handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage,
         `images/${currentUid}/${imageAvatar.name}`);

        const uploadTask = await uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) =>{
            
            getDownloadURL(snapshot.ref).then( async (downloadURL) =>{
                
                const docRef = doc(db, "users", currentUid)
                await updateDoc(docRef, {
                    avatarUrl: downloadURL,
                    nome: nome
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome:nome,
                        avatarUrl:downloadURL
                    }
                    setUser(data);
                    storageUser(data);
                    toast.success("Dados atualizados com sucesso!")
                })
            })

        })

    }
    async function handleSubmit(e){
        e.preventDefault();

        
        if(imageAvatar===null && nome !== ''){
            //atualizar apenas o nome
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome:nome
                }
                setUser(data);
                storageUser(data);
                toast.success("Nome atualizado com sucesso!")
            })
        }else if( imageAvatar!==null && nome!==''){
            //atualizar nome e foto
            handleUpload();
        }
    }

    return(
        <div>
            <Header/>

            <div className='content'>  
                <Title title="Minha conta">
                    <FiSettings size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile'
                    onSubmit={handleSubmit}>

                        <label className='label-avatar'>

                            <span >
                                <FiUpload color='#fff' size={25}/>
                            </span>

                            <input type='file' accept='image/*'
                            onChange={handleFile}/> <br/>

                            {avatarUrl === null ? (
                                <img src={avatar} alt ='Foto de perfil'
                                width={250} height={250}/>
                            ) : (
                                <img src={avatarUrl} alt ='Foto de perfil'
                                width={250} height={250}/>
                            )}
                        </label>

                        <label>Nome</label>
                        <input type='text' value={nome}
                        onChange={(e)=> setNome(e.target.value)}/>

                        <label>Email</label>
                        <input type='text' value={email}
                        disabled/>

                        <button type='submit'>Salvar</button>
                       
                    </form>
                </div>

                <div className='container'>
                    <button className='logout-btn'
                    //importante deixar a funcao anonima
                    //para executar só no click!
                    onClick={() => logout()}>Sair</button>
                </div>
               
            </div>

        </div>
    )
}