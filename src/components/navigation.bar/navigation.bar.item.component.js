import React from "react";
import { Link } from "react-router-dom";

const NavigationBarItem = ({ item }) => {
	if (item.displayType === "icon") {
		return (
			<li key={item.name}>
				<Link to={item.redirectUrl} style={{ textDecoration: "none" }}>
					<img src={item.iconUrl} alt="Logo of the website" width={50} />
				</Link>
			</li>
		);
	} else {
		return (
			<li key={item.name}>
				{item.isRedirectToOutside ? (
					<a
						href={item.redirectUrl}
						target="_blank"
						rel="noreferrer"
						style={{ textDecoration: "none" }}
					>
						{item.label}
					</a>
				) : (
					<Link to={item.redirectUrl} style={{ textDecoration: "none" }}>
						{item.label}
					</Link>
				)}
			</li>
		);
	}
};

export default NavigationBarItem;
