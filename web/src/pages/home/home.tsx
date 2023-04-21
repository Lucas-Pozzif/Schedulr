import { useNavigate } from "react-router-dom"

function Home() {

    const navigate = useNavigate()

    return (
        <>
            <p>Boa tarde, agende um serviço!</p>
            <button onClick={() => {
                navigate('/schedule')
            }}>Agendar</button>
            <div>

                <button onClick={() => {
                    navigate('/professional')
                }}>Tabela de servicos</button>
                <button onClick={() => {
                    navigate('/service')
                }}>Tabela de servicos</button>
            </div>
        </>
    )
}
export default Home