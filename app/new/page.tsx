import NewListForm from "@/components/forms/new-list-form"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar";
import { listPairs } from "@/lib/data";
import { Suspense } from "react";

export default function Page() {

  const randomIndex = Math.floor(Math.random() * listPairs.length);
  const selectedPair = listPairs[randomIndex];
  return (
    <div className="flex h-dvh relative flex flex-col overflow-hidden lg:flex-row ">
      <div className="lg:w-75 lg:border-r lg:h-dvh lg:flex lg:flex-col">
        <Header backToHomeBtn />
        <div className="hidden lg:block lg:flex-1">
          <Suspense>
            <Sidebar />
          </Suspense>
        </div>
      </div>
      <div className="px-4 flex flex-col justify-around h-5/8 lg:h-6/8 lg:w-full lg:max-w-3xl lg:mx-auto">
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

function Pages() {

  const randomIndex = Math.floor(Math.random() * listPairs.length);
  const selectedPair = listPairs[randomIndex];
  return (
    <div className="h-dvh relative flex flex-col overflow-hidden">
      <Header backToHomeBtn />
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
