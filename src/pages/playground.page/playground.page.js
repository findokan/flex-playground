const PlaygroundPage = () => {
	return (
		<div
			style={{
				flex: "1 1 auto",
				backgroundColor: "#f5f5f5",
				opacity: "0.3",
				backgroundImage:
					"linear-gradient(#989898 0.8px, transparent 0.8px), linear-gradient(90deg, #989898 0.8px, transparent 0.8px), linear-gradient(#989898 0.4px, transparent 0.4px), linear-gradient(90deg, #989898 0.4px, #f5f5f5 0.4px)",
				backgroundSize: "20px 20px, 20px 20px, 4px 4px, 4px 4px",
				backgroundPosition:
					"-0.8px -0.8px, -0.8px -0.8px, -0.4px -0.4px, -0.4px -0.4px",
			}}
		>
			PlaygroundPage
		</div>
	);
};

export default PlaygroundPage;
