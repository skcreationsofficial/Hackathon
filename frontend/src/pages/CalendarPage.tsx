import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
// import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
// import multiMonthPlugin from '@fullcalendar/multimonth'
import Button from "../components/Button/Button";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import Modal from '../components/Modal/Modal'
import useApiRequest from "../utils/useApiRequest";
import CustomSelect from "../components/Table/CustomSelect/CustomSelect";
import EventHoverCard from '../components/HoverCard/HoverCard'


export interface FieldConfig {
    name: string;
    label: string;
    type?: string;
    as?: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | string | undefined;
    placeholder?: string;
    rows?: number;
    min?: unknown;
    onChange?: (e: React.ChangeEvent<unknown>) => void;
    options?: string[] | number[];
}


const CalendarPage = () => {
    useApiRequest

    const [calendarType, setCalendarType] = useState<string>('dayGridMonth');
    const [loading, setLoading] = useState<string>('dayGridMonth');
    const [shiftValues, setShiftValues] = useState<any>([]);
    const [allShiftValues, setAllShiftValues] = useState<any>([]);
    const [userValues, setUserValues] = useState<any>([]);
    const [filterStaffValue, setFilterStaffValue] = useState<any>('');
    const [filterByValue, setFilterByValue] = useState<any>('role');

    const userNames = userValues?.map((datum: any)=>`${datum?.name} - ${datum?._id}`)

    const [formikFields, setFormikFields] = useState([
        // { name: 'role', label: 'Role', type: 'text', value: '', as: 'select', options: userNames},
        // { name: 'department', label: 'Department', type: 'text', value: '', as: 'select', options: userNames},
        { name: 'userId', label: 'Name', type: 'textNum', value: '', as: 'select', options: userNames},
        { name: 'date', label: 'Date', type: 'date', value: '' },
        { name: 'shift', label: 'Shift', type: 'text', value: '', as: 'select', options: ['Morning', 'Evening', 'Night']},
        { name: 'status', label: 'Status', type: 'text', value: '', as: 'select', options: ['Present', 'Absent', 'Leave']},
        { name: 'startTime', label: 'Start Time', type: 'time', value: '' },
        { name: 'endTime', label: 'End Time', type: 'time', value: '' },
    ])

    const userNameOptions = userValues?.map((datum: any, index: number)=>{
        if (index==0) {
            return [{name: "Show all", value: "all"}, {name: datum?.name, value: datum?._id}]
        } else {
            return {name: datum?.name, value: datum?._id}
        }
    }).flat(2)

    const filterByOptions = [
        {name: "Designation", value: "role"},
        {name: "Department", value: "department"},
        {name: "Staff", value: "userId"},
    ]

    const designationOptions: any = []
    const tempDesignationOptions: any = []

    userValues?.forEach((datum: any, index: number)=>{
        if (index==0) {
            designationOptions.push({name: "Show all", value: "all"})
            designationOptions.push({name: datum?.role, value: datum?.role})
            tempDesignationOptions.push(datum?.role)
        } else {
            console.log('!tempDesignationOptions.includes(datum?.role) +> ', tempDesignationOptions, datum?.role)
            if (datum?.role && !tempDesignationOptions.includes(datum?.role)) {
                designationOptions.push({name: datum?.role, value: datum?.role})
                tempDesignationOptions.push(datum?.role)
            }
        }
    })

    console.log('designationOptions => ', designationOptions)

    

    // ?.reduce((datum: any, acc: any)=>{
    //     console.log('reduce data => ', datum, acc)
    //     if(datum?.value && datum?.value==acc) {
    //         return datum?.value
    //     }
    // })

    const skillOptions = userValues?.map((datum: any, index: number)=>{
        if (index==0) {
            return [{name: "Show all", value: "all"}, {name: datum?.department, value: datum?.department}]
        } else {
            return {name: datum?.department, value: datum?.department}
        }
    }).flat(2)?.filter((datum: any)=>datum?.value)

    const selectOptions = filterByValue == "role" ? designationOptions : filterByValue == "department" ? skillOptions : filterByValue == "userId" ? userNameOptions : []

    const handleFetchData = async (value: string) => {

        let params;

        if (value=="") {
            params = {}
        } else {
            params = {property: filterByValue, value: value};
        }
        

        console.log('requestBody => ', params)
        
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

        // [
        //             { 
        //                 title: `Present (${20})`, 
        //                 date: '2025-05-03', 
        //                 display: 'background', 
        //                 backgroundColor: "#2563eb",  // Tailwind blue-600
        //                 borderColor: "#1e40af",      // Tailwind blue-800
        //                 textColor: "#fff"
        //                 allDay: true,
        //                 startTime: "16:00",
        //                 daysOfWeek: [5], // 5 = Friday
        //                 startRecur: "2025-05-01",
        //                 endRecur: "2025-05-31",
        //                 display: "list-item",
        //             },
        //         ]

        let formattedData;

        if (filterByValue != "userId") {
            let formatByCount: any = {}
            data?.data?.forEach((datum: any)=>{
                const formattedDate = datum?.date?.split('T')?.[0]
                if (Object.keys(formatByCount).includes(`${formattedDate}`)) {
                    formatByCount[`${formattedDate}`].push(datum?.status?.toLowerCase())
                } else {
                    formatByCount[`${formattedDate}`] = [datum?.status?.toLowerCase()]
                }
            })
            formattedData = Object.keys(formatByCount)?.map((datum)=>{
                return ['present', 'absent', 'leave'].map((status)=>{
                    return {
                    title: `${status} - (${formatByCount[datum]?.filter((filterData: any)=>filterData == status)?.length})`, 
                    // start: datum?.startTime?.split('T')?.[0], 
                    // end: datum?.endTime?.split('T')?.[0],
                    date: datum,
                    // display: datum?.status && 'background',
                    // backgroundColor: datum?.status?.toLowerCase() == "present" ? 'green' : datum?.status?.toLowerCase() == "absent" ? 'red' : 'gray'
                }})
            })?.flat(2)
        } else {
            formattedData = data?.data?.map((datum: any)=>{
            return {
                title: `${datum?.status}`, 
                // start: datum?.startTime?.split('T')?.[0], 
                // end: datum?.endTime?.split('T')?.[0],
                date: datum?.date?.split('T')?.[0],
                // display: datum?.status && 'background',
                // backgroundColor: datum?.status?.toLowerCase() == "present" ? 'green' : datum?.status?.toLowerCase() == "absent" ? 'red' : 'gray'
            }
        })
        }
        
        

        console.log('formattedData => ', formattedData)

        setAllShiftValues(data?.data)
        setShiftValues(formattedData);

    }

    const handleFetchUserData = async () => {

        const params = new URLSearchParams({
        });
        
        const config = {
            method: 'get',
            url: `http://localhost:5000/api/getAll?${params.toString()}`,
            params: {},
            data: {}, 
            headers: {},
            setLoading: setLoading,
            toastEnabled: false
        }

        const data = await useApiRequest(config)

        console.log('user data => ', data)

        setUserValues(data?.data?.data)

    }
   

    const handleDateClick = (arg: any) => {
        console.log('handleDateClick!', arg)
        // alert(arg.dateStr)
        document.getElementById('calendar-modal-id')?.click()
        setFormikFields([
            // { name: 'role', label: 'Role', type: 'text', value: '', as: 'select', options: userNames},
            // { name: 'department', label: 'Department', type: 'text', value: '', as: 'select', options: userNames},
            { name: 'userId', label: 'Name', type: 'textNum', value: '', as: 'select', options: userNames},
            { name: 'date', label: 'Date', type: 'date', value: arg?.dateStr },
            { name: 'shift', label: 'Shift', type: 'text', value: '', as: 'select', options: ['Morning', 'Evening', 'Night']},
            { name: 'status', label: 'Status', type: 'text', value: '', as: 'select', options: ['Present', 'Absent', 'Leave']},
            { name: 'startTime', label: 'Start Time', type: 'time', value: '' },
            { name: 'endTime', label: 'End Time', type: 'time', value: '' },
        ])
    }

    const handleAddShift = async (props: any) => {

        const requestBody = {...props, userId: props?.userId?.split(' - ')?.[1]}

        // console.log('Props => ', props, requestBody)

        const config = {
            method: 'post',
            url: `http://localhost:5000/api/calendar/create`,
            params: {},
            data: requestBody, 
            headers: {},
            setLoading: setLoading,
            toastEnabled: false
        }

        const data = await useApiRequest(config)

        console.log('created data => ', data, props)

        // setShiftValues([...shiftValues, data?.data])
        
        // location?.reload()

        document.getElementById('modal-close')?.click()
        
    }

    const handleFilterByStaff = (id: string) => {

        console.log('handleFilterByStaff => ', id)

        handleFetchData(id)

    }

    function renderEventContent(eventInfo: any) {

        // const selectedData = shiftValues?.find((datum)=>datum?.)
        
        // const userDetail = userValues?.find((datum: any)=>datum?._id == filterStaffValue)
        // const shiftDetail = allShiftValues?.find((datum: any)=>((datum?.userId == filterStaffValue) && (datum?.date.includes(shiftValues?.date))))

        // console.log('eventInfo => ', eventInfo, shiftDetail)

        // const exampleEvent = {
        //     title: userDetail?.name,
        //     role: userDetail?.role,
        //     date: "Thursday, May 18, 2017",
        //     time: "9:30 AM - 11:00 AM",
        //     location: "Room 102",
        //     roomColor: "#ec407a",
        // };

        let bgColor = "bg-blue-500 text-white";

        if (eventInfo.event.title?.includes('present')) {
            bgColor = "bg-green-500 text-white"
        } else if (eventInfo.event.title?.includes('absent')) {
            bgColor = "bg-red-500 text-white"
        } else if (eventInfo.event.title?.includes('leave')) {
            bgColor = "bg-gray-500 text-white"
        }
        
        console.log('eventInfo.event => ', eventInfo.event.title, eventInfo)

        const handleUpdateModal = () => {
            document.getElementById('calendar-modal-id')?.click()
            // setFormikFields([
            //     // { name: 'role', label: 'Role', type: 'text', value: '', as: 'select', options: userNames},
            //     // { name: 'department', label: 'Department', type: 'text', value: '', as: 'select', options: userNames},
            //     { name: 'userId', label: 'Name', type: 'textNum', value: '', as: 'select', options: userNames},
            //     { name: 'date', label: 'Date', type: 'date', value: arg?.dateStr },
            //     { name: 'shift', label: 'Shift', type: 'text', value: '', as: 'select', options: ['Morning', 'Evening', 'Night']},
            //     { name: 'status', label: 'Status', type: 'text', value: '', as: 'select', options: ['Present', 'Absent', 'Leave']},
            //     { name: 'startTime', label: 'Start Time', type: 'time', value: '' },
            //     { name: 'endTime', label: 'End Time', type: 'time', value: '' },
            // ])
        }

        return(
            <div className="cursor-pointer" onClick={handleUpdateModal}>
                {filterByValue == "userId"
                ?
                <div className={`p-1`}>
                    {/* <div
                        className="bg-yellow-300 px-4 py-2 cursor-pointer rounded"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    > */}
                        <i className="font-bold text-white">{eventInfo.event.title}</i>
                        {/* {hovered && <EventHoverCard event={exampleEvent} />} */}
                    {/* </div> */}
                </div>
                :
                <div className={`${bgColor}`}>
                    <i className={`font-bold text-white`}>{eventInfo.event.title}</i>
                    {/* <p className="text-white bg-yellow-500">{`Assigned ()`}</p> */}
                    {/* <p className="text-white bg-green-500">{"Present ()"}</p> */}
                    {/* <p className="text-white bg-red-500">{"Absent ()"}</p> */}
                    {/* <p className="text-white bg-gray-500">{"Leave ()"}</p> */}
                </div>
                }
            </div>
        )
    }

    useEffect(() => {
    }, [calendarType]);

    useEffect(()=>{
        handleFetchData('')
        handleFetchUserData()
    }, [])

    console.log('userValues => ', userNames)

    return (
        <div>
            <div className="flex justify-end mb-2">
                {/* <p className="p-2 m-1 bg-red-500">filter by designation</p> */}
                {/* <p className="p-2 m-1 bg-red-500">filter by skill</p> */}
                <CustomSelect
                    label={'Filter by'}
                    value={filterByValue}
                    name={''}
                    options={filterByOptions}
                    onChange={(e)=>{setFilterByValue(e?.target?.value)}}
                    classNames="me-2"
                />
                <CustomSelect
                    label={'Value'}
                    value={filterStaffValue}
                    name={''}
                    options={selectOptions}
                    onChange={(e)=>{handleFilterByStaff(e?.target?.value);setFilterStaffValue(e?.target?.value)}}
                    classNames="me-2"
                />
                {/* <p className="p-2 m-1 bg-red-500">search</p> */}
                <Modal 
                    type={"add"} 
                    modalTitle={"Add shift"}
                    buttonLabel={"add shift"}
                    className="p-2 m-1" 
                    formikFields={formikFields}
                    onSubmit={handleAddShift} 
                    id={'calendar-modal-id'}
                />
            </div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                // weekends={false}
                events={shiftValues}
                headerToolbar={{
                    left: "prev today next",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                height="auto"
                dateClick={handleDateClick}
                eventContent={renderEventContent}
            />                
            <ToastContainer />
        </div>
    );
};

export default CalendarPage;