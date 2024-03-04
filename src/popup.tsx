import { CountButton } from "~features/CountButton"
import Model from "~features/Model"

import "~style.css"

function IndexPopup() {
  return (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-16 plasmo-w-40">
      <CountButton />
      <Model />
    </div>
  )
}

export default IndexPopup
