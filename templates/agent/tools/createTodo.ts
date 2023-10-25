import { DynamicStructuredTool } from 'langchain/tools'
import z from 'zod'
import { db, todos } from "../schema";

export async function createTodo({text}: {text: string}) {
  
    const addedTodo = await db.insert(todos).values([{
        complete: 0,
        text
    }])
  
    console.log(addedTodo)
      
    return JSON.stringify(addedTodo)
}

export default function createTodoTool() {
  return new DynamicStructuredTool({
    description: "Create a todo",
    func: async ({text}) => {
      return JSON.stringify(await createTodo({text}));
    },
    name: "listTodos",
    schema: z.object({text: z.string()})
  });
}