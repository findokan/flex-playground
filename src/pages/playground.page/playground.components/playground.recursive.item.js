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
				direction: item.styleAttributes.flex.direction,
				flexDirection: item.styleAttributes.flex.flexDirection,
				flexBasis: item.styleAttributes.flex.basis,
				flexGrow: item.styleAttributes.flex.grow,
				flexShrink: item.styleAttributes.flex.shrink,
				flexWrap: item.styleAttributes.flex.flexWrap,
				justifyContent: item.styleAttributes.alignment.justifyContent,
				alignItems: item.styleAttributes.alignment.alignItems,
				alignSelf: item.styleAttributes.alignment.alignSelf,
				alignContent: item.styleAttributes.alignment.alignContent,
				width: item.styleAttributes.layout.width,
				height: item.styleAttributes.layout.height,
				maxWidth: item.styleAttributes.layout.maxWidth,
				maxHeight: item.styleAttributes.layout.maxHeight,
				minWidth: item.styleAttributes.layout.minWidth,
				minHeight: item.styleAttributes.layout.minHeight,
				aspectRatio: item.styleAttributes.layout.aspectRatio,
				paddingTop: item.styleAttributes.layout.paddingTop + "px",
				paddingLeft: item.styleAttributes.layout.paddingLeft + "px",
				paddingRight: item.styleAttributes.layout.paddingRight + "px",
				paddingBottom: item.styleAttributes.layout.paddingBottom + "px",
				marginTop: item.styleAttributes.layout.marginTop + "px",
				marginLeft: item.styleAttributes.layout.marginLeft + "px",
				marginRight: item.styleAttributes.layout.marginRight + "px",
				marginBottom: item.styleAttributes.layout.marginBottom + "px",
				position: item.styleAttributes.layout.positionType,
				top: item.styleAttributes.layout.top
					? item.styleAttributes.layout.top + "px"
					: "unset",
				right: item.styleAttributes.layout.right
					? item.styleAttributes.layout.right + "px"
					: "unset",
				bottom: item.styleAttributes.layout.bottom
					? item.styleAttributes.layout.bottom + "px"
					: "unset",
				left: item.styleAttributes.layout.left
					? item.styleAttributes.layout.left + "px"
					: "unset",
				backgroundColor: "white",
				display: "flex",
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
