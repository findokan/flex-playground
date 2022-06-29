import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import { TabPanel, a11yProps } from "./playground.tabpanel";

const PGMenu = ({ DOM, setDOM, selectedItemId, setSelectedItemId }) => {
	const [value, setValue] = useState(0);
	const [willEditedItem, setWillEditedItem] = useState(
		getSelectedItem(DOM, selectedItemId)
	);

	useEffect(() => {
		setWillEditedItem(getSelectedItem(DOM, selectedItemId));
	}, [DOM, selectedItemId]);

	const handleTabChange = (event, newValue) => {
		setValue(newValue);
	};

	//#region DOM MANIPULATION HELPERS
	function isRootNode() {
		return DOM.id === selectedItemId ? true : false;
	}

	function getSelectedItem(tempDOM, selectedItemId) {
		if (tempDOM.id === selectedItemId) {
			return tempDOM;
		} else {
			for (let elementIndex in tempDOM.children) {
				const selectedItem = getSelectedItem(
					tempDOM.children[elementIndex],
					selectedItemId
				);
				if (selectedItem) return selectedItem;
			}
		}
	}

	function getParentItem(tempDOM, selectedItemId) {
		if (
			tempDOM.children.findIndex((child) => child.id === selectedItemId) !== -1
		) {
			return tempDOM;
		} else {
			for (let elementIndex in tempDOM.children) {
				const selectedItem = getParentItem(
					tempDOM.children[elementIndex],
					selectedItemId
				);
				if (selectedItem) return selectedItem;
			}
		}
	}
	//#endregion

	//#region DOM MANIPULATION
	function editDOM(tempDOM, editedItem) {
		if (tempDOM.id === editedItem.id) {
			return editedItem;
		}
		if (tempDOM.children !== undefined && tempDOM.children.length > 0) {
			for (let i = 0; i < tempDOM.children.length; i++) {
				tempDOM.children[i] = editDOM(tempDOM.children[i], editedItem);
			}
		}

		return tempDOM;
	}

	function addChildNodeToSelectedItem() {
		let selectedItem = JSON.parse(
			JSON.stringify(getSelectedItem(DOM, selectedItemId))
		);
		selectedItem.children.push({
			id: (parseInt(window.lastID) + 1).toString(),
			label: (parseInt(window.lastID) + 1).toString(),
			styleAttributes: {
				flex: {
					direction: "ltr",
					flexDirection: "row",
					basis: "auto",
					grow: 0,
					shrink: 1,
					flexWrap: "no-wrap",
				},
				alignment: {},
				layout: {
					width: 100,
					height: 100,
					maxWidth: null,
					maxHeight: null,
					minWidth: null,
					minHeight: null,
					aspectRatio: "auto",
				},
			},
			children: [],
		});
		window.lastID = (parseInt(window.lastID) + 1).toString();
		const editedDOM = JSON.parse(JSON.stringify(editDOM(DOM, selectedItem)));
		setDOM(editedDOM);
	}

	function deleteNode() {
		let parentItem = JSON.parse(
			JSON.stringify(getParentItem(DOM, selectedItemId))
		);
		const childIndex = parentItem.children.findIndex(
			(child) => child.id === selectedItemId
		);
		parentItem.children.splice(childIndex, 1);
		const editedDOM = JSON.parse(JSON.stringify(editDOM(DOM, parentItem)));
		setDOM(editedDOM);
		setSelectedItemId("");
	}
	//#endregion

	//#region RENDER FUNCTIONS
	function renderNoSelectedItem() {
		return (
			<span className="pg-menu-no-data">
				Select a node to edit its properties
			</span>
		);
	}

	function renderSelectedItem() {
		function renderAddRMNodeButtons() {
			return (
				<div className="pg-menu-add-rm-area">
					<Button
						variant="contained"
						onClick={(e) => {
							e.stopPropagation();
							addChildNodeToSelectedItem();
						}}
					>
						add child node
					</Button>
					<Button
						variant="outlined"
						disabled={isRootNode()}
						onClick={(e) => {
							e.stopPropagation();
							deleteNode();
						}}
					>
						delete node
					</Button>
				</div>
			);
		}

		return (
			<div>
				<Box
					sx={{ width: "100%" }}
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={value}
							onChange={handleTabChange}
							aria-label="basic tabs example"
						>
							<Tab label="Flex" {...a11yProps(0)} />
							<Tab label="Alignment" {...a11yProps(1)} />
							<Tab label="Layout" {...a11yProps(2)} />
						</Tabs>
					</Box>
					<TabPanel value={value} index={0}>
						Flex
					</TabPanel>
					<TabPanel value={value} index={1}>
						Alignment
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Typography>Width x Height</Typography>
						<div className="pg-menu-input-aligner">
							<TextField
								value={willEditedItem?.styleAttributes?.layout.width}
								onChange={(e) => {
									if (e.target.value.length === 0) {
										e.target.value = "0";
									}
									let clonedItem = JSON.parse(JSON.stringify(willEditedItem));
									clonedItem.styleAttributes.layout.width = parseInt(
										e.target.value
									);
									const editedDOM = JSON.parse(
										JSON.stringify(editDOM(DOM, clonedItem))
									);
									setDOM(editedDOM);
								}}
							/>
							<TextField
								value={willEditedItem?.styleAttributes?.layout.height}
								onChange={(e) => {
									debugger;
									if (e.target.value.length === 0) {
										e.target.value = "0";
									}
									let clonedItem = JSON.parse(JSON.stringify(willEditedItem));
									clonedItem.styleAttributes.layout.height = parseInt(
										e.target.value
									);
									const editedDOM = JSON.parse(
										JSON.stringify(editDOM(DOM, clonedItem))
									);
									setDOM(editedDOM);
								}}
							/>
						</div>
					</TabPanel>
				</Box>
				{renderAddRMNodeButtons()}
			</div>
		);
	}
	//#endregion

	return (
		<div className="pg-menu">
			<div className="pg-menu-share">
				<div className="pg-menu-share-item">Get Code</div>
				<div className="pg-menu-share-item">Share</div>
			</div>
			<div className="pg-menu-box">
				{selectedItemId === "" ? renderNoSelectedItem() : renderSelectedItem()}
			</div>
		</div>
	);
};

export default PGMenu;
