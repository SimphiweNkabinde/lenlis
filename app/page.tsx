import NewListForm from "@/components/forms/new-list-form"
import Header from "@/components/header"
import { listPairs } from "@/lib/data";

export default function Page() {

  const randomIndex = Math.floor(Math.random() * listPairs.length);
  const selectedPair = listPairs[randomIndex];
  return (
    <div className="h-dvh relative flex flex-col overflow-hidden">
      <Header />
      <div className="px-4 flex flex-col justify-around h-5/8">
        <p className="text-muted-foreground text-sm text-center">
          From {selectedPair[0]} to {selectedPair[1]}. <br /> Every list starts here.
        </p>
        <div>
          <h1 className="text-2xl text-center mb-5">Start a new list</h1>
          <NewListForm />
        </div>
      </div>
    </div>
  )
}
