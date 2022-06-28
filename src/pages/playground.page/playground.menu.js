const PGMenu = ({ DOM, setDOM, selectedItemId }) => {
	function isRootNode() {
		return DOM.id === selectedItemId ? true : false;
	}

	function getSelectedItem(tempDOM, selectedItemId) {
		if (tempDOM.id === selectedItemId) {
			return tempDOM;
		} else {
			for (let elementIndex in tempDOM.childs) {
				const selectedItem = getSelectedItem(
					tempDOM.childs[elementIndex],
					selectedItemId
				);
				if (selectedItem) return selectedItem;
			}
		}
	}

	function getParentItem(tempDOM, selectedItemId) {
		if (
			tempDOM.childs.findIndex((child) => child.id == selectedItemId) !== -1
		) {
			return tempDOM;
		} else {
			for (let elementIndex in tempDOM.childs) {
				const selectedItem = getParentItem(
					tempDOM.childs[elementIndex],
					selectedItemId
				);
				if (selectedItem) return selectedItem;
			}
		}
	}

	function editDOM(tempDOM, editedItem) {
		if (tempDOM.id === editedItem.id) {
			return editedItem;
		}
		if (tempDOM.childs !== undefined && tempDOM.childs.length > 0) {
			for (let i = 0; i < tempDOM.childs.length; i++) {
				tempDOM.childs[i] = editDOM(tempDOM.childs[i], editedItem);
			}
		}

		return tempDOM;
	}

	function addChildNodeToSelectedItem() {
		let selectedItem = JSON.parse(
			JSON.stringify(getSelectedItem(DOM, selectedItemId))
		);
		selectedItem.childs.push({
			id: (parseInt(window.lastID) + 1).toString(),
			label: (parseInt(window.lastID) + 1).toString(),
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
		});
		window.lastID = (parseInt(window.lastID) + 1).toString();
		const editedDOM = editDOM(DOM, selectedItem);
		setDOM(editedDOM);
	}

	function deleteNode() {
		let parentItem = JSON.parse(
			JSON.stringify(getParentItem(DOM, selectedItemId))
		);
		const childIndex = parentItem.childs.findIndex(
			(child) => child.id === selectedItemId
		);
		parentItem.childs.splice(childIndex, 1);
		const editedDOM = editDOM(DOM, parentItem);
		setDOM(editedDOM);
	}

	function renderNoSelectedItem() {
		return (
			<span className="pg-menu-no-data">
				Select a node to edit its properties
			</span>
		);
	}

	function renderSelectedItem() {
		return (
			<div>
				{selectedItemId}
				<button
					onClick={(e) => {
						e.stopPropagation();
						addChildNodeToSelectedItem();
					}}
				>
					add child node
				</button>
				<button
					disabled={isRootNode()}
					onClick={(e) => {
						e.stopPropagation();
						deleteNode();
					}}
				>
					delete node
				</button>
			</div>
		);
	}

	return (
		<div className="pg-menu">
			<div className="pg-menu-share">
				<div className="pg-menu-share-item">Get Code</div>
				<div className="pg-menu-share-item">Share</div>
			</div>
			<div className="pg-menu-box">
				{selectedItemId === "" ? renderNoSelectedItem() : renderSelectedItem()}
			</div>
		</div>
	);
};

export default PGMenu;
