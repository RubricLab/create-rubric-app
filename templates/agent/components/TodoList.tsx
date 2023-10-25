import { listTodos } from "../tools/listTodos"

export default async function TodoList() {

    const todos = await listTodos()
    
    return (
        <h1>
            {todos.map((todo) => (
                <h2 key={todo.id}>
                    <input checked={todo.complete === 1} type="checkbox" />
                    {" "}{todo.text}
                </h2>
            ))}
        </h1>
    )
}

