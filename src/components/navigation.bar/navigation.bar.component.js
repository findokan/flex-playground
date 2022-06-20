import NavigationBarItem from "./navigation.bar.item.component";

const NavigationBar = ({ navigationBarItems }) => {
	return (
		<nav>
			<ul
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					listStyleType: "none",
					padding: 0,
				}}
			>
				{navigationBarItems.map((item) => (
					<div style={{ marginLeft: "40px" }}>
						<NavigationBarItem key={item.name} item={item} />
					</div>
				))}
			</ul>
		</nav>
	);
};

export default NavigationBar;
