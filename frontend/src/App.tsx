import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

function App() {
  const [id, setId] = useState(1);
  const [on, setOn] = useState(true);

  const { data, isPending, refetch, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodos(id),
    enabled: on,
  });

  if (error) {
    alert("Some thing went wrong")
  }

  return (
    <>
      <div>{isPending ? <h1>LOADING </h1> : JSON.stringify(data.slice(0,10))}</div>
      <button onClick={() => refetch()}>refetch</button>
      <button onClick={() => setId(i => i+1)}>increment id</button>
    </>
  )
}

async function getTodos(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`)
  return await response.json();
}

export default App
