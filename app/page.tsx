import NewListForm from "@/components/forms/new-list-form"
import Header from "@/components/header"

export default function Page() {
  return (
    <div className="h-dvh relative flex flex-col overflow-hidden">
      <Header title="lenlis" />
      <NewListForm />
    </div>
  )
}
