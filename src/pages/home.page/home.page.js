import { useRef } from "react";
import { Button } from "@mui/material";
import { homePagePlaygroundState } from "../../constants";
import PlaygroundPage from "../playground.page/playground.page";

const HomePage = () => {
	const pgArea = useRef(null);

	return (
		<div>
			<div className="hp-welcome-container">
				<div className="hp-welcome-column">
					<span className="hp-welcome-up-title">INTRODUCING</span>
					<div className="hp-welcome-title">
						Portfolio Project: <br></br> Learn Flex
					</div>
					<div className="hp-welcome-sub-text">
						Hello, this project was inspired by the playground page in
						Facebook's yoga project. The project only includes the playground
						and provides facilities for flex training and prototype design.
					</div>
					<div>
						<Button
							variant="contained"
							size="large"
							onClick={(e) => pgArea.current.scrollIntoView()}
						>
							Try It
						</Button>
					</div>
				</div>
				<div className="hp-welcome-column">
					<div className="hp-blueprint-container hp-blueprint-border">
						<div className="hp-blueprint-avatar hp-blueprint-border"></div>
						<div className="hp-blueprint-title hp-blueprint-border"></div>
						<div className="hp-blueprint-subtitle hp-blueprint-border"></div>
						<div className="hp-blueprint-content hp-blueprint-border"></div>
					</div>
				</div>
			</div>
			<div className="hp-pg-container" ref={pgArea}>
				<PlaygroundPage initialState={homePagePlaygroundState} />
			</div>
			<div className="hp-welcome-container">
				<div className="hp-welcome-column">
					<div className="hp-welcome-title">Lorem Ipsum</div>
					<div className="hp-welcome-sub-text">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</div>
					<div className="hp-list-items">
						<img
							className="hp-list-item"
							src="https://via.placeholder.com/200"
							width={200}
							alt="dummy_image"
						/>
						<img
							className="hp-list-item"
							src="https://via.placeholder.com/200"
							width={200}
							alt="dummy_image"
						/>
						<img
							className="hp-list-item"
							src="https://via.placeholder.com/200"
							width={200}
							alt="dummy_image"
						/>
						<img
							className="hp-list-item"
							src="https://via.placeholder.com/200"
							width={200}
							alt="dummy_image"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
