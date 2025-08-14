import { useQuery } from "@tanstack/react-query"

function App() {

  const { data, isPending, refetch, error } = useQuery({
    queryKey: ['todo'],
    queryFn: getTodos,
  });

  if (error) {
    alert("Something went wrong")
  }

  return (
    <>
      <div>{isPending ? <h1>LOADING </h1> : JSON.stringify(data.slice(0,10))}</div>
      <button onClick={() => refetch()}>refetch</button>
    </>
  )
}

async function getTodos() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const response = await fetch("https://jsonplaceholder.typicode.com/todos")
  return await response.json();
}

export default App
