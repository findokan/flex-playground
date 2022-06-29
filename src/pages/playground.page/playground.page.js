import { useEffect, useState } from "react";
import PGRecursiveItem from "./playground.components/playground.recursive.item";
import PGMenu from "./playground.components/playground.menu";

const PlaygroundPage = ({ initialState }) => {
	// pgState works as DOM (Document Object Model). It's have data structure base on tree.
	// There is one root element and has relationg as parent-child with other nodes.
	const [pgState, setPGState] = useState(initialState);

	// State that stores id of which user clicked/selected a node.
	const [selectedItemId, setSelectedItemId] = useState("");

	useEffect(() => {
		// When the component mounts, initializes the last used id because of we have two child node.
		window.lastID = "2";
	}, []);

	return (
		<div
			className="pg-container"
			onClick={(e) => {
				// Stop propagation for getting top object for overlapped nodes
				e.stopPropagation();
				setSelectedItemId("");
			}}
		>
			<div className="pg-area">
				<PGRecursiveItem
					item={pgState}
					setSelectedItemId={setSelectedItemId}
					selectedItemId={selectedItemId}
				/>
			</div>
			<div className="pg-menu-container">
				<PGMenu
					DOM={pgState}
					setDOM={setPGState}
					selectedItemId={selectedItemId}
					setSelectedItemId={setSelectedItemId}
				/>
			</div>
		</div>
	);
};

export default PlaygroundPage;
