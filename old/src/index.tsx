import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'
import './styles/reset.css'


const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<App />
);