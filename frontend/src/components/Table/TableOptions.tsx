import React, {useState} from "react";
import DebouncedInput from "./DebouncedInput/DebouncedInput";
import CustomSelect from "./CustomSelect/CustomSelect";
import ExportToCSVButton from "./TableExportCsv";
import ExportToExcelButton from "./TableExportExcel";
import ExportToPDFButton from "./TableExportToPdf";
import Modal from '../Modal/Modal'
import type { TableOptionsProps, HeaderValues } from "../../interfaces/components/Table";

const TableOptions: React.FC<TableOptionsProps> = ({headerValues, tableOptionValues, rowValues, footerValues}) => {

    const sortableValues = headerValues.filter((datum: HeaderValues)=>datum?.sortable == true)

    const [tagValues, setTagValues] = useState<HeaderValues[]>(sortableValues)
    const [removedTagValues, setRemovedTagValues] = useState<HeaderValues[]>([])

    const sortableFields = headerValues?.filter((filterDatum: HeaderValues)=>filterDatum?.sortable)?.map((data: HeaderValues, index: number)=>{
        if (index==0) {
            return [
                { name: "Select Field", value: "" }, 
                { name: data?.header, value: data?.accessor }
            ]
        } else {
            return { name: data?.header, value: data?.accessor }
        }
    }).flat()

    const sortOrders = [
        { name: "Select Field", value: "" },
        { name: "Ascending", value: "asc" },
        { name: "Descending", value: "desc" },
    ];

    const exportCount = [
        { name: "Select count", value: "" },
        { name: "10", value: 10 },
        { name: "100", value: 100 },
        { name: "500", value: 500 },
        { name: "1000", value: 1000 },
        { name: "All", value: 100000000 }
    ];

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 items-center">
                <DebouncedInput placeholder="Search..." className="px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-black-100" value={tableOptionValues?.searchTerm} onChange={(value: string)=>tableOptionValues?.onSearchChange?.(value)} />
                <div className="flex gap-1 items-center">
                    <label htmlFor="sortBy" className="px-1 block text-xs font-medium text-gray-700">
                        Sort By
                    </label>
                    <CustomSelect
                        name="sortField"
                        value={tableOptionValues?.sortField}
                        options={sortableFields}
                        onChange={(e) => tableOptionValues?.onSortFieldChange?.(e.target.value)}
                    />
                    <CustomSelect
                        name="sortOrder"
                        value={tableOptionValues?.sortOrder}
                        options={sortOrders}
                        onChange={(e) => tableOptionValues?.onSortOrderChange?.(e.target.value)}
                    />
                    <Modal modalTitle="Export to CSV" buttonLabel="Export to CSV" className="bg-blue-800 hover:bg-blue-900">
                        <div className="my-5">
                            Number of items to be exported :
                            <CustomSelect
                                name="sortOrder"
                                value={footerValues?.count}
                                options={exportCount}
                                onChange={(e) => footerValues?.onCountChange(Number(e.target.value))}
                            />
                            <p className="mt-2">Columns to be exported :</p>
                            <div className="flex bg-gray-100 p-2 rounded-lg">
                                {tagValues?.map((datum: HeaderValues, index: number)=>{
                                    return <div className="text-xs p-1 bg-blue-300 mx-1 rounded-lg">
                                        {datum?.header}
                                        <span className="ps-1 cursor-pointer" onClick={()=>{setTagValues(()=>tagValues?.filter((datum: unknown, idx:number)=>index!=idx));setRemovedTagValues([...removedTagValues, datum])}}>x</span>
                                    </div>
                                })}
                            </div>    
                            <div className="flex mt-1">
                                {removedTagValues?.map((datum: HeaderValues, index: number)=>{
                                    return <div className="text-xs p-1 bg-gray-300 mx-1 rounded-lg">
                                        {datum?.header}
                                        <span className="ps-1 cursor-pointer" onClick={()=>{setRemovedTagValues(()=>removedTagValues?.filter((datum: unknown, idx:number)=>index!=idx));setTagValues([...tagValues, datum])}}>+</span>
                                    </div>
                                })}
                            </div>                 
                        </div>
                        
                        {tagValues?.length > 0 && <ExportToCSVButton 
                            data={rowValues}
                            headers={tagValues}
                            fileName={'Export.csv'}
                            footerValues={footerValues}
                        />}

                    </Modal>
                    
                    <Modal modalTitle="Export to Excel" buttonLabel="Export to Excel" className="bg-green-800 hover:bg-green-900">
                        <div className="my-5">
                            Number of items to be exported :
                            <CustomSelect
                                name="sortOrder"
                                value={footerValues?.count}
                                options={exportCount}
                                onChange={(e) => footerValues?.onCountChange(Number(e.target.value))}
                            />
                            <p className="mt-2">Columns to be exported :</p>
                            <div className="flex bg-gray-100 p-2 rounded-lg">
                                {tagValues?.map((datum: HeaderValues, index: number)=>{
                                    return <div className="text-xs p-1 bg-blue-300 mx-1 rounded-lg">
                                        {datum?.header}
                                        <span className="ps-1 cursor-pointer" onClick={()=>{setTagValues(()=>tagValues?.filter((datum: unknown, idx:number)=>index!=idx));setRemovedTagValues([...removedTagValues, datum])}}>x</span>
                                    </div>
                                })}
                            </div>    
                            <div className="flex mt-1">
                                {removedTagValues?.map((datum: HeaderValues, index: number)=>{
                                    return <div className="text-xs p-1 bg-gray-300 mx-1 rounded-lg">
                                        {datum?.header}
                                        <span className="ps-1 cursor-pointer" onClick={()=>{setRemovedTagValues(()=>removedTagValues?.filter((datum: unknown, idx:number)=>index!=idx));setTagValues([...tagValues, datum])}}>+</span>
                                    </div>
                                })}
                            </div>
                        </div>
                        {tagValues?.length > 0 && <ExportToExcelButton
                            data={rowValues}
                            fileName={"Export.xlsx"}
                            sheetName={"Sheet1"}
                            footerValues={footerValues}
                            headerValues={headerValues}
                        />}
                    </Modal>

                    <Modal modalTitle="Export to PDF" buttonLabel="Export to PDF" className="bg-red-800 hover:bg-red-900">
                        <div className="my-5">
                            Number of items to be exported :
                            <CustomSelect
                                name="sortOrder"
                                value={footerValues?.count}
                                options={exportCount}
                                onChange={(e) => footerValues?.onCountChange(Number(e.target.value))}
                            />
                            <p className="mt-2">Columns to be exported :</p>
                            <div className="flex bg-gray-100 p-2 rounded-lg">
                                {tagValues?.map((datum: HeaderValues, index: number)=>{
                                    return <div className="text-xs p-1 bg-blue-300 mx-1 rounded-lg">
                                        {datum?.header}
                                        <span className="ps-1 cursor-pointer" onClick={()=>{setTagValues(()=>tagValues?.filter((datum: HeaderValues, idx:number)=>index!=idx));setRemovedTagValues([...removedTagValues, datum])}}>x</span>
                                    </div>
                                })}
                            </div>    
                            <div className="flex mt-1">
                                {removedTagValues?.map((datum: HeaderValues, index: number)=>{
                                    return <div className="text-xs p-1 bg-gray-300 mx-1 rounded-lg">
                                        {datum?.header}
                                        <span className="ps-1 cursor-pointer" onClick={()=>{setRemovedTagValues(()=>removedTagValues?.filter((datum: HeaderValues, idx:number)=>index!=idx));setTagValues([...tagValues, datum])}}>+</span>
                                    </div>
                                })}
                            </div>
                        </div>
                        {tagValues?.length > 0 && <ExportToPDFButton 
                            columns={tagValues} 
                            data={rowValues} 
                            title="Report"  
                            footerValues={footerValues}
                        />}
                    </Modal>

                </div>
            </div>
        </div>
    );
};

export default TableOptions;