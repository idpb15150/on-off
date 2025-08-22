import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#F472B6", "#FCD34D"];

const SalesChannelChart = () => {
	const [salesData, setSalesData] = useState([
		{ name: "factory 1", value: 0 },
		{ name: "factory 2", value: 0 },
		{ name: "factory 5", value: 0 },
		{ name: "factory 7", value: 0 },
	]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response1 = await axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory1");
				const factory1Value = response1.data.factory1?.operation_present || 0;

				const response2 = await axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory2");
				const factory2Value = response2.data.factory2?.operation_present || 0;

				const response3 = await axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory5");
				const factory5Value = response3.data.factory5?.operation_present || 0;

				const response4 = await axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory7");
				const factory7Value = response4.data.factory7?.operation_present || 0;

				setSalesData([
					{ name: "fac 1", value: factory1Value },
					{ name: "fac 2", value: factory2Value },
					{ name: "fac 5", value: factory5Value },
					{ name: "fac 7", value: factory7Value },
				]);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Factory Operations</h2>

			<div className='h-80'>
				<ResponsiveContainer>
					<BarChart data={salesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey='name' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' domain={[0, 100]} />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Bar dataKey={"value"} fill='#8884d8'>
							{salesData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SalesChannelChart;
