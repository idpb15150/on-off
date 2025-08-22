import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { motion } from "framer-motion";

const API_URL = "http://192.168.23.32:1880/factory_oparation_all";

const SalesOverviewChart = () => {
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(API_URL);
				const data = await response.json();
				if (!data || !Array.isArray(data)) {
					console.error("Invalid data format:", data);
					return;
				}

				let formattedData = data.map((item) => ({
					name: new Date(item.createat).toLocaleDateString("en-GB"), // dd/mm/yyyy
					percents: parseInt(item.oparation_present_all, 10),
				}));

				formattedData.sort((a, b) => new Date(a.name) - new Date(b.name));

				// 🔥 เลือก 7 วันล่าสุด
				formattedData = formattedData.slice(-7);

				// เพิ่มข้อมูลการเปลี่ยนแปลง
				formattedData = formattedData.map((item, index, arr) => {
					if (index === 0) return { ...item, changePercent: 0, color: "#E5E7EB" };
					const prev = arr[index - 1].percents;
					const changePercent = ((item.percents - prev) / prev) * 100;
					const color = changePercent >= 0 ? "#10B981" : "#EF4444";
					return {
						...item,
						changePercent: changePercent.toFixed(1),
						color,
					};
				});

				setChartData(formattedData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
		const interval = setInterval(fetchData, 30000);
		return () => clearInterval(interval);
	}, []);

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Report Overview</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey={"name"} stroke='#9ca3af' />
						<YAxis stroke='#9ca3af' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='percents'
							stroke='#6366F1'
							strokeWidth={3}
							dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
							activeDot={{ r: 8, strokeWidth: 2 }}
						>
							<LabelList
								dataKey="changePercent"
								position="top"
								content={({ x, y, value, index }) => (
									<text
										x={x}
										y={y - 5}
										fill={chartData[index]?.color || "#E5E7EB"}
										fontSize={12}
										textAnchor="middle"
									>
										{value >= 0 ? `+${value}%` : `${value}%`}
									</text>
								)}
							/>
						</Line>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SalesOverviewChart;
