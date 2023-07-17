import {ChangeEvent, useEffect, useState} from 'react'
import './App.css'



interface IData {
    id: number,
    title: string,
    checked: boolean
}

function App() {
    const [inputState, setInputState] = useState<string>('')
    const [data, setData] = useState<IData[]>([])
    const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
        setInputState(event.target.value)
    }


    useEffect(() => {
        fetch('https://todo-postgres.onrender.com/api/get-all')
            .then(res => res.json())
            .then(responseData => setData(responseData))
    }, [])


    const handleButtonClick = async (title: string) => {
        const response = await fetch('https://todo-postgres.onrender.com/api/post', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                title
            })
        });
        const { data } = await response.json()
        setData(prevState => [...prevState, data])
        setInputState('')
    }

    const handleCheckboxChange = async (id: number, checked: boolean) => {
        try {
            const response = await fetch(`https://todo-postgres.onrender.com/api/check/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({
                    checked: !checked
                })
            });
            const { data } = await response.json()
            setData(prevState => prevState.map(elem => elem.id === id ? data[0] : elem))
        }catch (e){
            console.error(e)
        }
    }
    const handleDeleteClick = async (id: number) => {
        try {
            await fetch(`https://todo-postgres.onrender.com/api/delete/${id}`, {
                method: "DELETE"
            })
            setData(prevState => prevState.filter(elem => elem.id !== id))
        }catch (e){
            console.error(e)
        }
    }
    return (
        <div className='App'>
            <div className='header'>
                <input className='header_input' type="text" value={inputState} onChange={handleInputChange} placeholder='Input Todo ...'/>
                <button disabled={!inputState} onClick={() => handleButtonClick(inputState)}>Add Todo</button>
            </div>
            <div className='todo_container'>
                {
                    data.length ? data.map(({ title, checked, id}) => {
                            return <div className='each_todo_container' key={id}>
                                <div className='each_todo_div'>
                                    <span>{ title }</span>
                                </div>
                                <input className='checkbox' type="checkbox" checked={checked} onChange={() => handleCheckboxChange(id, checked)}/>
                                <button className='delete_button' onClick={() => handleDeleteClick(id)}>Delete</button>
                            </div>

                        })
                        :
                        <h1>Database is empty</h1>
                }
            </div>
        </div>
    )
}

export default App
