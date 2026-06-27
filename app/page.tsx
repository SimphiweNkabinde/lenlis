import Header from "@/components/header"
import ListContainer from "@/components/list-container"
import ListHeader from "@/components/list-header"
import ListItemInput from "@/components/list-item-input"

export default function Page() {
  return (
    <div className="flex h-dvh relative flex flex-col overflow-hidden">
      <Header />
      <ListHeader />
      <ListContainer />
      <ListItemInput />
    </div>
  )
}
