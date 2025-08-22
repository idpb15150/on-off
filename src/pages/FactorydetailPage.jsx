import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import Header from "../components/common/Header";

const STATUS_API_URL = "http://192.168.23.32:1880/api/onoff/mc";
const METER_API_URL = "http://192.168.23.32:1880/oee/p/totalmeter";

const UsersPage = () => {
	const [stationData, setStationData] = useState({});
	const [meterData, setMeterData] = useState({});

	const fetchData = async () => {
		try {
			const [statusRes, meterRes] = await Promise.all([
				axios.get(STATUS_API_URL),
				axios.get(METER_API_URL),
			]);

			setStationData(statusRes.data);
			setMeterData(meterRes.data.total_meter || {});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, 5000); // รีเฟรชทุก 5 วิ
		return () => clearInterval(interval);
	}, []);

	const handleRefresh = () => {
		fetchData();
	};

	// 👉 คำนวณ ON / TOTAL โดยไม่รวม Phase2
	const flatValues = Object.values(stationData).flatMap(Object.entries);
	const filtered = flatValues.filter(([_, v]) => v !== "Phase2");
	const activeCount = filtered.filter(([_, v]) => v === true).length;
	const totalCount = filtered.length;

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Factory Overall" />

			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<div className="flex justify-between mb-6 items-center">
					{/* 👈 Total summary ด้านซ้าย */}
					<div className="flex items-baseline space-x-2 text-white text-lg">
						<span className="font-semibold">Total:</span>
						<span className="font-bold text-green-500">{activeCount}</span>
						<span className="font-bold text-white">/</span>
						<span className="font-bold text-red-500">{totalCount}</span>
					</div>

					{/* 👉 ปุ่ม Refresh ด้านขวา */}
					<button
						onClick={handleRefresh}
						className="px-4 py-2 bg-gray-800 text-white border-2 border-white rounded-md shadow-md hover:bg-gray-700 transition"
					>
						Refresh Data
					</button>
				</div>

				<motion.div
					className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					{Object.entries(stationData).map(([station, values]) => {
						// 🔹 กรอง Phase2 ออกก่อนนับ active / total ในแต่ละ station
						const entries = Object.entries(values);
						const filteredEntries = entries.filter(([_, v]) => v !== "Phase2");
						const activeCount = filteredEntries.filter(([_, v]) => v === true).length;
						const totalCount = filteredEntries.length;

						return (
							<div key={station} className="p-4 bg-gray-800 text-white rounded-xl shadow-md">
								<h3 className="text-lg font-semibold mb-2">{station}</h3>
								<p className="text-sm mb-2">
									Active: <span className="font-bold text-green-600">{activeCount}</span> / Total: {totalCount}
								</p>
								<ul className="text-sm divide-y divide-gray-700">
									{entries.map(([machine, status]) => {
										const meterValue = meterData[machine.toLowerCase()];
										return (
											<li key={machine} className="py-1">
												<div className="flex items-center space-x-2">
													{/* ชื่อเครื่อง */}
													<span className="w-1/3 truncate">{machine}</span>

													{/* ON/OFF หรือ Phase2 */}
													<span
														className={`w-1/3 text-center font-semibold ${
															status === true
																? "text-green-500"
																: status === false
																? "text-red-500"
																: "text-yellow-300"
														}`}
													>
														{status === "Phase2" ? "Phase2" : status ? "ON" : "OFF"}
													</span>

													{/* Meter */}
													<span className="w-1/3 text-right text-yellow-400 font-medium">
														{meterValue !== undefined ? `Length: ${meterValue.toLocaleString()}` : ""}
													</span>
												</div>
											</li>
										);
									})}
								</ul>
							</div>
						);
					})}
				</motion.div>
			</main>
		</div>
	);
};

export default UsersPage;
