import "virtual:uno.css"
import "@unocss/reset/tailwind.css"
import { render } from "preact"
import App from "./app.tsx"

render(<App />, document.getElementById("app") as HTMLElement)
