import './App.css';
import ErrorBoundary from './components/error-boundry';
import ModalForm from './components/modal-form';

function App() {

  return <ErrorBoundary>
    <ModalForm/>
  </ErrorBoundary>;
}

export default App;