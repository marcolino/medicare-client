import { render, screen } from "@testing-library/react"
import App from "../src/App"

describe("App", () => {
  it("renders the App component", () => {
    render(<App />)
    //screen.debug(); // prints out the jsx in the App component onto the command line
  })
})