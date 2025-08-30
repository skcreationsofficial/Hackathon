import React, { useState } from "react";
import Modal from "../components/Modal/Modal";
import { ToastContainer } from "react-toastify";
import TableComponent from "../components/Table/TableComponent";
import CustomSelect from "../components/Table/CustomSelect/CustomSelect";
import { clearToken } from '../redux/store/slice';
import { useSelector, useDispatch } from 'react-redux';
import OptimalTable from 'optimal-table'


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


const TablePage = () => {

    const tokenData = useSelector((state: any) => state.slice.token);
    console.log('tokenData => ', tokenData)
    // const dispatch = useDispatch();

    const [apiConfig, setApiConfig] = useState({
        method: 'get',
        url: `http://localhost:5000/api/getAll`,
        query: {},
        params: {},
        data: {},
        headers: {
            authorization: tokenData
        },
        toastEnabled: false,
        operation: "fetch"
    })

    const addFormikFields = [
        { name: 'name', label: 'Name', type: 'text', value: '' },
        { name: 'email', label: 'Email', type: 'email', value: '' },
        { name: 'phone', label: 'Phone number', type: 'phone', value: '' },
        { name: 'gender', label: 'Gender', type: 'text', value: '', as: 'select', options: ['Male', 'Female', 'Other'] },
    ]
    

    const handleEditModal = async (row: {_id: string}, values: unknown) => {

        setApiConfig({
            method: 'patch',
            url: `http://localhost:5000/api/update/${String(row?._id)}`,
            params: {},
            data: values,
            headers: {
                authorization: tokenData
            },
            toastEnabled: true,
            operation: 'update'
        })

        document.getElementById('modal-close')?.click()

    };

    // resetForm()

    const onChangeInput = async (row: any, props: any) => {

        setApiConfig({
            method: 'patch',
            url: `http://localhost:5000/api/update/${row?._id}`,
            query: {},
            params: {},
            data: {status: props?.target?.value}, 
            headers: {
                authorization: tokenData
            },
            toastEnabled: true,
            operation: 'update'
        })

        document.getElementById('modal-close')?.click()

    }

    const handleAddModal = async (values: any) => {

        setApiConfig({
            method: 'post',
            url: `http://localhost:5000/api/create`,
            query: {},
            params: {},
            data: values,
            headers: {
                authorization: tokenData
            },
            toastEnabled: true,
            operation: "create"
        })

        document.getElementById('modal-close')?.click()
        
    }

    const handleDeleteModal = async (row: any) => {

        setApiConfig({
            method: 'patch',
            url: `http://localhost:5000/api/delete/${row?._id}`,
            query: {},
            params: {},
            data: {isActive: false},
            headers: {
                authorization: tokenData
            },
            toastEnabled: true,
            operation: 'delete'
        })

        document.getElementById('modal-close')?.click()

    }

    const headerValues: any[] = [
        { header: "Name", accessor: "name", sortable: true },
        { header: "Email", accessor: "email", sortable: true },
        { header: "Phone No", accessor: "phone", sortable: true, style: "badge-danger" },
        { 
            header: "Status", 
            accessor: "status", 
            render: (_value: any, row: any) => {

                console.log('render values => ', _value, row)
                const customSelectOptions = [
                    {name: 'Select an option', value: ''},
                    {name: 'Present', value: 'present'},
                    {name: 'Absent', value: 'absent'}
                ]

                return <>
                    <CustomSelect
                        // label={}
                        value={row['status'] ? row['status'] : ''}
                        name={''}
                        options={customSelectOptions}
                        // err={}
                        // classNames={}
                        // disabled={true}
                        onChange={(e)=>onChangeInput(row, e)}
                    />
                </>
            },
            sortable: false
         },
        {
            header: "Actions",
            accessor: "_id",
            render: (_value: any, row: any) => {

                console.log('render values => ', _value, row)

                const editFormikFields = [
                    { name: 'name', label: 'Name', type: 'text', value: row['name'] },
                    { name: 'email', label: 'Email', type: 'email', value: row['email'] },
                    { name: 'phone', label: 'Phone number', type: 'phone', value: row['phone'] },
                    { name: 'gender', label: 'Gender', type: 'text', value: row['gender'], as: 'select', options: ['Male', 'Female', 'Other'] }
                ]

                const formikFields = [
                    { name: 'name', label: 'Name', type: 'text', value: '' }
                ]

                const viewFormikFields = [
                    { name: 'name', label: 'Name', type: 'text', value: row['name'] },
                    { name: 'email', label: 'Email', type: 'email', value: row['email'] },
                    { name: 'phone', label: 'Phone number', type: 'text', value: row['phone'] },
                    { name: 'gender', label: 'Gender', type: 'text', value: row['gender'] }
                ]

                return <div className="flex">
                    <Modal 
                        modalTitle={"View user"} 
                        buttonLabel={""} 
                        type={"view"} 
                        onSubmit={()=>{}} 
                        formikFields={viewFormikFields}
                    />
                    {/* <Modal 
                        modalTitle={"Add user"} 
                        buttonLabel={""} 
                        type={"add"} 
                        onSubmit={handleAddModal} 
                        formikFields={addFormikFields} 
                    /> */}
                    <Modal 
                        modalTitle={"Edit user"} 
                        buttonLabel={""} 
                        type={"edit"} 
                        onSubmit={(e: any)=>handleEditModal(row, e)} 
                        formikFields={editFormikFields} 
                    />
                    <Modal 
                        modalTitle={"Delete user"} 
                        buttonLabel={""} 
                        type={"delete"}
                        onSubmit={()=>handleDeleteModal(row)} 
                        formikFields={{formikFields}} 
                    />
                </div>
            },
            sortable: false
        },
    ];

    

    return (
        <div>
            <div className="flex justify-end m-5">
                <Modal 
                    modalTitle={"Add user"} 
                    buttonLabel={" Add user"} 
                    type={"add"} 
                    onSubmit={handleAddModal} 
                    formikFields={addFormikFields} 
                />
            </div>
            
            <TableComponent
                apiConfig={apiConfig}
                headerValues={headerValues}
            />

            {/* <OptimalTable
                apiConfig={apiConfig}
                headerValues={headerValues}
            /> */}

            <ToastContainer />
        </div>
    );
};

export default TablePage;