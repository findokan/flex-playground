import { Routes, Route } from "react-router-dom";

// Page Imports
import Layout from "./components/layout.component";
import HomePage from "./pages/home.page/home.page";
import DocumentationPage from "./pages/documentation.page/documentation.page";
import PlaygroundPage from "./pages/playground.page/playground.page";
import NoPage from "./pages/no.page/no.page";

// Constant Imports
import navigationBarItems from "./constants";

// CSS Imports
import "./App.css";

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={<Layout navigationBarItems={navigationBarItems} />}
			>
				<Route index element={<HomePage />} />
				<Route path="docs" element={<DocumentationPage />} />
				<Route path="playground" element={<PlaygroundPage />} />
				<Route path="*" element={<NoPage />} />
			</Route>
		</Routes>
	);
}

export default App;
