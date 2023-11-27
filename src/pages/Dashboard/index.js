import "./index.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { format } from "date-fns";

import Modal from "../../components/Modal";

const listRef = collection(db, "chamados");

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState({})

  useEffect(() => {
    async function loadChamados() {
      const q = query(listRef, orderBy("created", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      setChamados([]);
      await updateState(querySnapshot);

      setLoading(false);
    }

    loadChamados();

    //quando desmontar o componente...
    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      console.log(querySnapshot);

      //react strict mode buga isso, pois monta o componente 2 vezes
      setChamados((chamados) => [...chamados, ...lista]);
      //setChamados(lista) --> nao da pra fazer pois quando buscar mais, a lista resetará
      // para corrigir, no useeffect resetar os chamados com setChamados([]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  function toggleModal(item){
     setShowPostModal(!showPostModal)
     setDetail(item)
  }

  async function handleMore(){
    setLoadingMore(true);

    const q = query(listRef, orderBy("created", "desc"), startAfter(lastDocs), limit(5));


    const querySnapshot = await getDocs(q);

    await updateState(querySnapshot);


  }

  if(loading){
    return(
        <div>
            <Header/>
            <div className="content">
                <Title title="Sistema de chamados">
                    <FiMessageSquare size={25} />
                </Title>

                <div className="container dashboard">
                    <span>Buscando chamados...</span>
                </div>


            </div>
        </div>
    )
  }
  return (
    <div>
      <Header />
      <div className="content">
        <Title title="Sistema de chamados">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>

              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((chamado, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{chamado.cliente}</td>
                        <td data-label="Assunto">{chamado.assunto}</td>
                        <td data-label="Status">
                          <span
                            className="badge"
                            style={{ backgroundColor: chamado.status==='Aberto' ? 
                            '#5cb85c' : chamado.status==='Atendido'? 
                            '#999' : '#c4b600' }}
                          >
                            {chamado.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{chamado.createdFormat}</td>
                        <td data-label="#">
                          <button
                            className="action"
                            style={{ backgroundColor: "#3583f6" }}
                            onClick={() => toggleModal(chamado)}
                          >
                            <FiSearch color="#FFF" size={17} />
                          </button>

                          <Link to={`/new/${chamado.id}`}
                            className="action"
                            style={{ backgroundColor: "#f6a935" }}
                          >
                            <FiEdit2 color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {loadingMore && <h3>Buscando mais chamados...</h3>}
              {!loading && !isEmpty && 
                <button onClick={handleMore} 
                        className="btn-more">
                            Buscar mais
                </button>
              }
            </>
          )}
        </>
      </div>


      {
        showPostModal && (
          <Modal
            conteudo={detail}
            close ={ () => setShowPostModal(!showPostModal)}
          />
        )
      }

    </div>
  );
}