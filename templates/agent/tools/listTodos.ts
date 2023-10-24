import { db, todos } from "../schema";

export default async function listTodos() {
  console.log(db);
  
  const addedTodo = await db.insert(todos).values([{
    complete: false,
    text: "test"
  }])
  console.log(addedTodo);
  
  const allTodos = await db.select().from(todos).all()
  console.log(allTodos);
}