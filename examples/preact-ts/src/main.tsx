// eslint-disable-next-line import/no-unresolved
import "uno.css"
import { render } from "preact"
import App from "./app.tsx"

render(<App />, document.getElementById("app") as HTMLElement)
