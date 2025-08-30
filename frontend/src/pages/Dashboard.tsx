import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import ChartComponent from "../components/Chart/Chart";
import QRCodeGenerator from "../components/qrGenerator/qrGenerator";
import useApiRequest from '../utils/useApiRequest'
import Modal from '../components/Modal/Modal';


interface Stat {
    title: string;
    value: number;
    color: string;
}
interface Activity {
    action: string;
    userName: string;
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    
    const navigate = useNavigate();
    const [stats] = useState<Stat[]>([
        { title: 'Total', value: 0, color: 'bg-blue-500' },
        { title: 'Active', value: 0, color: 'bg-green-500' },
        { title: 'Pending', value: 0, color: 'bg-yellow-500' },
    ]);
    const [recentActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false)
    const [fetchedData, setFetchedData] = useState(null)


    const handleFetchData = async (value: string) => {

        let params = {}
                
        const config = {
            method: 'post',
            url: `http://localhost:5000/api/calendar/getAll`,
            params: {},
            data: params, 
            headers: {},
            setLoading: setLoading,
            toastEnabled: false
        }

        const data = await useApiRequest(config)

        console.log('formattedData => ', data)

        setFetchedData(data?.data)

    }

    useEffect(() => {
        handleFetchData('')
    }, []);


    return (
        <>
            <div className="min-h-screen">

                <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 p-4">
                    {/* Stats Grid */}
                    <div className="flex justify-space-between mb-4">

                        {stats.map((data: Stat, index: number) => (
                            <div key={index} className={`rounded-lg shadow p-3 text-white basis-1/6 m-3 ${data?.color}`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{data.title}</h3>
                                </div>
                                <p className="mt-2 text-3xl font-semibold">{data.value}</p>
                            </div>
                        ))}

                        <div className={`rounded-lg shadow p-3 text-white basis-3/6 m-3 bg-black`}>
                            <div className="flex items-center justify-between place-content-center">
                                <div className=''>
                                    <p className="text-sm font-bold">Scan the QR</p>
                                    <p className="text-sm">To get the latest shift information →</p>
                                </div>
                                <div>
                                    <Modal buttonLabel="Generate QR" modalTitle="Scan the QR">
                                        <QRCodeGenerator 
                                            value="date: 2025-05-03T05:50:26.213170Z | 
                                                    shift: morning |
                                                    status: leave |
                                                    startTime: 2025-05-17T05:50:26.213170Z |
                                                    endTime: 2025-05-17T13:50:26.213170Z" 
                                            size={350} 
                                            includeMargin 
                                        />
                                    </Modal>
                                </div>
                                
                            </div>
                            <p className="mt-2 text-3xl font-semibold"></p>
                        </div>
                        
                    </div>

                    <div className='flex'>

                        <div className='basis-3/5 m-2'>
                            <ChartComponent 
                                type="radar" 
                                data={fetchedData} 
                                chartTitle={"Votes per Color"} 
                                legendPosition={"bottom"}
                                accessor={{primary: `date`, secondary: `shift`}}
                            />
                        </div>

                        <div className='basis-2/5 m-2 w-[10vw]'>
                            <ChartComponent 
                                type="doughnut" 
                                data={fetchedData} 
                                chartTitle={"Shift Category"} 
                                legendPosition={"bottom"}
                                accessor={{primary: `date`, secondary: `shift`}}
                            />
                        </div>

                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow">
                            <div className="p-6 max-h-[500px] overflow-y-auto">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                                <div className="space-y-4">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map((activity, index) => (
                                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                                    <p className="text-sm text-gray-500">{activity.userName}</p>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(activity.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No recent activity found.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;
