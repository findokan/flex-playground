const navigationBarItems = [
	{
		name: "homepage",
		label: "Home Page",
		displayType: "icon",
		iconUrl: "/flex-playground-logo.png",
		redirectUrl: "/",
		isRedirectToOutside: false,
	},
	{
		name: "documentation",
		label: "Documentation",
		displayType: "text",
		iconUrl: null,
		redirectUrl: "/docs",
		isRedirectToOutside: false,
	},
	{
		name: "playground",
		label: "Playground",
		displayType: "text",
		iconUrl: null,
		redirectUrl: "/playground",
		isRedirectToOutside: false,
	},
	{
		name: "github",
		label: "GitHub",
		displayType: "text",
		iconUrl: null,
		redirectUrl: "https://github.com/findokan/flex-playground",
		isRedirectToOutside: true,
	},
];

export default navigationBarItems;
