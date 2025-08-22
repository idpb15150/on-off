import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndustry } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";

const OverviewPage = () => {
  const [totalSalesFactory1, setTotalSalesFactory1] = useState(0);
  const [totalSalesFactory2, setTotalSalesFactory2] = useState(0);
  const [totalSalesFactory5, setTotalSalesFactory5] = useState(0);
  const [totalSalesFactory7, setTotalSalesFactory7] = useState(0);
  const [totalSalesOverall, setTotalSalesOverall] = useState(0); // ✅ Factory Overall จาก Venine

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2, response5, response7, responseOverall] = await Promise.all([
          axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory1"),
          axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory2"),
          axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory5"),
          axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory7"),
          axios.get("http://192.168.23.32:1880/api/status/machine/realtime/factory")
        ]);

        setTotalSalesFactory1(Math.round(response1.data.factory1?.operation_present || 0));
        setTotalSalesFactory2(Math.round(response2.data.factory2?.operation_present || 0));
        setTotalSalesFactory5(Math.round(response5.data.factory5?.operation_present || 0));
        setTotalSalesFactory7(Math.round(response7.data.factory7?.operation_present || 0));
        setTotalSalesOverall(Math.round(responseOverall.data.Venine?.venine_operation || 0));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Overview' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Factory 1' icon={() => <FontAwesomeIcon icon={faIndustry} />} value={`${totalSalesFactory1}%`} color='#8B5CF6' />
          <StatCard name='Factory 2' icon={() => <FontAwesomeIcon icon={faIndustry} />} value={`${totalSalesFactory2}%`} color='#6366F1' />
          <StatCard name='Factory 5' icon={() => <FontAwesomeIcon icon={faIndustry} />} value={`${totalSalesFactory5}%`} color='#EC4899' />
          <StatCard name='Factory 7' icon={() => <FontAwesomeIcon icon={faIndustry} />} value={`${totalSalesFactory7}%`} color='#10B981' />
          <StatCard name='Factory Overall' icon={() => <FontAwesomeIcon icon={faIndustry} />} value={`${totalSalesOverall}%`} color='#F59E0B' />
        </motion.div>

        {/* CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;