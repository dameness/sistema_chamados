import './index.css'
export default function Title({children, title}){
    
    return(
        <div className='title'>
            {children}
            <span>{title}</span>
        </div>
    )
}