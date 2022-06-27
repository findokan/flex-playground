const PGRecursiveItem = ({ item, setSelectedItemId, selectedItemId }) => {
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
			}}
			onClick={(e) => {
				e.stopPropagation();
				setSelectedItemId(item.id);
			}}
		>
			{item.childs.map((child) => {
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
