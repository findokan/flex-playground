import React from "react";

const NavigationBarItem = ({ item }) => {
	function isSelected() {
		return window.location.pathname === item.redirectUrl ? true : false;
	}

	if (item.displayType === "icon") {
		return (
			<li key={item.name}>
				<a href={item.redirectUrl}>
					<img src={item.iconUrl} alt="Logo of the website" width={35} />
				</a>
			</li>
		);
	} else {
		return (
			<li key={item.name}>
				<a
					className={isSelected() ? "selected" : null}
					href={item.redirectUrl}
					target={item.isRedirectToOutside ? "_blank" : null}
					rel={item.isRedirectToOutside ? "noreferrer" : null}
				>
					{item.label}
				</a>
			</li>
		);
	}
};

export default NavigationBarItem;
