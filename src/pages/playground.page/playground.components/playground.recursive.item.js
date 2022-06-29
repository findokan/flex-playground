const PGRecursiveItem = ({ item, setSelectedItemId, selectedItemId }) => {
	// Item that generates the whole expected object according to DOM. Works with
	// recursive logic for generating the child nodes.

	function calculateClass() {
		var baseClass = "pg-base-item";
		if (item.id === selectedItemId) {
			baseClass += " pg-selected-item";
		}
		return baseClass;
	}

	return (
		<div
			id={item.id}
			className={calculateClass()}
			style={{
				height: item.styleAttributes.layout.height,
				width: item.styleAttributes.layout.width,
				backgroundColor: "white",
				display: "flex",
				flexDirection: item.styleAttributes.flex.flexDirection,
				backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1'><text x='48%' y='50%' fill='%239a9a9a' font-size='150%' dominant-baseline='middle' text-anchor='middle'>${item.label}</text></svg>")`,
			}}
			onClick={(e) => {
				e.stopPropagation();
				setSelectedItemId(item.id);
			}}
		>
			{item.children.map((child) => {
				return (
					<PGRecursiveItem
						item={child}
						key={child.id}
						setSelectedItemId={setSelectedItemId}
						selectedItemId={selectedItemId}
					/>
				);
			})}
		</div>
	);
};

export default PGRecursiveItem;
