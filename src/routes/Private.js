import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'

export default function Private({ children }){
    const {signed, loading} = useContext(AuthContext);

    if(loading){
        return(
            <div><h1>Aguarde um momento...</h1></div>
        )
    }
    if(!signed)
        return <Navigate to="/"/>

    return children;
}