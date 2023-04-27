import { Line } from '../../../components/line/line'
import './authentication-header.css'

const designCache = require('../../../cache/designCache.json')

export function AuthenticationHeader() {
    const logo = designCache[0].lightLogo

    return (
        <div className="auth-header">
            <img className="logo" src={logo} />
            <div className='header-text'>
                <Line />
                <p className='header-title'>Atendimento é a nossa prioridade!</p>
                <p className='header-subtitle'>Para isso precisamos te conhecer melhor.</p>
                <Line />
            </div>

        </div>
    )
}