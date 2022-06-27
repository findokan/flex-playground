import NavigationBarItem from "./navigation.bar.item.component";

const NavigationBar = ({ navigationBarItems }) => {
	return (
		<nav>
			<ul className="menu-item-container">
				{navigationBarItems.map((item) => (
					<div className="menu-item" key={item.name}>
						<NavigationBarItem key={item.name} item={item} />
					</div>
				))}
			</ul>
		</nav>
	);
};

export default NavigationBar;
