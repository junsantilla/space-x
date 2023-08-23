import React, { useState, useEffect } from "react";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";

// Component for displaying individual launch information
function Launch({ launch }) {
	return (
		<li key={launch.id} className="flex items-center space-x-4">
			<img
				src={launch.links.patch.large}
				alt="Patch"
				className="flex-shrink-0 w-32 h-32 object-cover"
				onError={(e) => {
					e.target.src = "placeholder.png"; // Display a placeholder image if the patch image fails to load
				}}
			/>
			<div>
				<h2 className="text-md font-semibold mb-1">
					{launch.flight_number} : {launch.name} (
					{new Date(launch.date_utc).getFullYear()})
				</h2>
				<p className="text-gray-700 mt-1">{launch.details}</p>
			</div>
		</li>
	);
}

function App() {
	const [launches, setLaunches] = useState([]); // State for storing launch data
	const [hasMore, setHasMore] = useState(true); // State to track if there are more launches to load
	const [loading, setLoading] = useState(false); // State to track loading status
	const [page, setPage] = useState(0); // State to track the current page of data

	// Function to fetch launch data from the SpaceX API
	const fetchData = async (page) => {
		try {
			setLoading(true); // Start loading
			const response = await fetch(
				"https://api.spacexdata.com/v4/launches/"
			);
			const data = await response.json();
			const startIndex = page * 10;
			const endIndex = startIndex + 10;
			setTimeout(() => {
				setLaunches([...launches, ...data.slice(startIndex, endIndex)]); // Append new data to existing launches
				setLoading(false); // Stop loading
			}, 1500); // Simulate a delay for a smoother loading experience
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	// Fetch data when the page changes
	useEffect(() => {
		fetchData(page);
	}, [page]);

	// Function to handle loading more data when the user scrolls
	const handleLoadMore = () => {
		if (!loading) {
			setPage(page + 1); // Increment the page number
			fetchData(page + 1); // Fetch data for the next page
		}
	};

	return (
		<div className="App">
			<main className="flex justify-center items-center bg-gray-100 min-h-screen">
				<div className="max-w-4xl w-full px-6">
					<InfiniteScroll
						dataLength={launches.length} // Current number of launches
						next={handleLoadMore} // Function to call when more data should be loaded
						hasMore={hasMore} // Whether there are more launches to load
						loader={
							<div className="flex justify-center items-center ">
								<img
									src="loading.gif"
									className="mb-10 w-16 h-16"
									alt="Loading"
								/>
							</div>
						} // Loading indicator
						endMessage={<p>No more launches to show.</p>} // Message to display when all launches are loaded
					>
						<ul className="space-y-6 p-10 border my-10 bg-white">
							{launches.map((launch) => (
								<Launch key={launch.id} launch={launch} />
							))}
						</ul>
					</InfiniteScroll>
				</div>
			</main>
		</div>
	);
}

export default App;
