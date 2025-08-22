import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
	const [categoryData, setCategoryData] = useState([
		{ name: "Factory 1", value: 0 },
		{ name: "Factory 2", value: 0 },
		{ name: "Factory 5", value: 0 },
		{ name: "Factory 7", value: 0 },
	]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log("Fetching data...");

				const [fac1,fac2, fac5, fac7] = await Promise.all([
					axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory1"),
					axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory2"),
					axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory5"),
					axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory7"),
				]);

				// ดึงค่า operation_present จาก API
				const factory1Value = fac1.data.factory1?.operation_present || 0;
				const factory2Value = fac2.data.factory2?.operation_present || 0;
				const factory5Value = fac5.data.factory5?.operation_present || 0;
				const factory7Value = fac7.data.factory7?.operation_present || 0;

				console.log("Factory 2:", factory2Value);
				console.log("Factory 5:", factory5Value);
				console.log("Factory 7:", factory7Value);

				setCategoryData([
					{ name: "Factory 1", value: factory1Value },
					{ name: "Factory 2", value: factory2Value },
					{ name: "Factory 5", value: factory5Value },
					{ name: "Factory 7", value: factory7Value },
				]);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Analysis Data</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={categoryData}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{categoryData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default CategoryDistributionChart;
