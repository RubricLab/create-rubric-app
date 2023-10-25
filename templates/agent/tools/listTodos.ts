import { DynamicStructuredTool } from 'langchain/tools'
import z from 'zod'
import { db, todos } from "../schema";

export async function listTodos() {
  const allTodos = await db.select().from(todos).all()

  console.log(allTodos)
  
  return allTodos;
}

export default function listTodosTool() {
  return new DynamicStructuredTool({
    description: "List all todos",
    func: async () => {
      return JSON.stringify(await listTodos());
    },
    name: "listTodos",
    schema: z.object({})
  });
}