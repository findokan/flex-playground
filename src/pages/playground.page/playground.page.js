import { useEffect, useState } from "react";
import PGRecursiveItem from "./playground.recursive.item";
import PGMenu from "./playground.menu";

const PlaygroundPage = () => {
	const [pgState, setPGState] = useState({
		id: "pgRoot",
		label: "root",
		styleAttributes: {
			flex: {
				direction: "ltr",
				flexDirection: "row",
				basis: "auto",
				grow: 0,
				shrink: 1,
				flexWrap: "no-wrap",
			},
			alignment: {},
			layout: {
				width: 500,
				height: 500,
				maxWidth: null,
				maxHeight: null,
				minWidth: null,
				minHeight: null,
				aspectRatio: "auto",
			},
		},
		childs: [
			{
				id: "1",
				label: "1",
				styleAttributes: {
					flex: {
						direction: "ltr",
						flexDirection: "row",
						basis: "auto",
						grow: 0,
						shrink: 1,
						flexWrap: "no-wrap",
					},
					alignment: {},
					layout: {
						width: 100,
						height: 100,
						maxWidth: null,
						maxHeight: null,
						minWidth: null,
						minHeight: null,
						aspectRatio: "auto",
					},
				},
				childs: [],
			},
			{
				id: "2",
				label: "2",
				styleAttributes: {
					flex: {
						direction: "ltr",
						flexDirection: "row",
						basis: "auto",
						grow: 0,
						shrink: 1,
						flexWrap: "no-wrap",
					},
					alignment: {},
					layout: {
						width: 100,
						height: 100,
						maxWidth: null,
						maxHeight: null,
						minWidth: null,
						minHeight: null,
						aspectRatio: "auto",
					},
				},
				childs: [],
			},
		],
	});
	const [selectedItemId, setSelectedItemId] = useState("");

	return (
		<div
			className="pg-container"
			onClick={(e) => {
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
				<div className="pg-menu">
					<PGMenu dom={pgState} selectedItemId={selectedItemId} />
				</div>
			</div>
		</div>
	);
};

export default PlaygroundPage;
