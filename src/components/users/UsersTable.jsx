import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const API_URL = "http://192.168.23.32:1880/cctv/fac";

const CameraTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [fullData, setFullData] = useState([]); // เก็บข้อมูลทั้งหมดจาก API
	const [cameraData, setCameraData] = useState([]); // เก็บเฉพาะ 10 รายการล่าสุด
	const [filteredData, setFilteredData] = useState([]); // ข้อมูลที่จะแสดงผล

	// Fetch data from API
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(API_URL);
				const data = await response.json();

				// เพิ่ม status: "Active" ให้ทุกตัว
				const updatedData = data.map((cam) => ({
					...cam,
					status: "Active",
				}));

				setFullData(updatedData); // เก็บข้อมูลทั้งหมด
				const latestData = updatedData.slice(-5); // เลือก 10 รายการล่าสุด
				setCameraData(latestData);
				setFilteredData(latestData); // ค่าเริ่มต้นให้แสดงแค่ 10 รายการ
			} catch (error) {
				console.error("Error fetching camera data:", error);
			}
		};

		fetchData();
	}, []);

	// Handle search
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);

		if (term === "") {
			// ถ้าเคลียร์ช่องค้นหา ให้กลับมาแสดง 10 รายการล่าสุด
			setFilteredData(cameraData);
		} else {
			// ค้นหาในข้อมูลทั้งหมด
			const filtered = fullData.filter(
				(cam) =>
					cam.NVR_Venine.toLowerCase().includes(term) ||
					cam.Camera_Location.toLowerCase().includes(term) ||
					cam.IP_Address.includes(term)
			);
			setFilteredData(filtered);
		}
	};

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Latest 5 Cameras</h2>
				<div className="relative">
					<input
						type="text"
						placeholder="Search cameras..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-700">
					<thead>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								NVR Venine
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Camera Location
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								IP Address
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Status
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-700">
						{filteredData.map((cam) => (
							<motion.tr
								key={cam.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className="px-6 py-4 whitespace-nowrap text-gray-100">{cam.NVR_Venine}</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-300">{cam.Camera_Location}</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-300">{cam.IP_Address}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
										{cam.status}
									</span>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};

export default CameraTable;
