import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function App() {
  const dispatch = useDispatch();
  const elements = useSelector(store => store.elementList)
  const ships = useSelector(store => store.ships)
  const [newElement, setNewElement] = useState('');

  const getElements = () => {
    // axios.get('/api/element').then(response => {
    //   dispatch({ type: 'SET_ELEMENTS', payload: response.data });
    // })
    //   .catch(error => {
    //     console.log('error with element get request', error);
    //   });
    
    // watcher saga looks for dispatch action types
    dispatch({type: 'GET_ELEMENTS', payload: 'hello world saga'});
    dispatch({type: 'GET_SHIPS'});
  }

  useEffect(() => {
    getElements();
  }, []);

  const addElement = () => {
    // axios.post('/api/element', { 
    //   name: newElement
    // })
    //   .then(() => {
    //     getElements();
    //     setNewElement('');
    //   })
    //   .catch(error => {
    //     console.log('error with element get request', error);
    //   });
    dispatch({type: 'ADD_ELEMENT', payload: newElement});
    getElements();
    setNewElement('');
  }


  return (
    <div>
      <h1>Atomic Elements</h1>
      <h3>{JSON.stringify(ships)}</h3>
      <ul>
        {elements.map(element => ( // add i or index to make the key unique
          <li key={element}>
            {element}
          </li>
        ))}
      </ul>

      <input 
        value={newElement} 
        onChange={evt => setNewElement(evt.target.value)} 
      />
      <button onClick={addElement}>Add Element</button>
    </div>
  );
}


export default App;
