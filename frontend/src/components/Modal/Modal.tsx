import React, { useState, useEffect } from "react";
import FormikForm from "../Form/FormikForm";


const SelfContainedModal: React.FC<any> = ({
  modalTitle = "Modal Title",
  buttonLabel = "",
  type = "custom",
  onSubmit,
  data,
  children,
  formikFields,
  className = "",
  id=""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        id={id}
        className={`px-4 mx-1 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer flex place-content-center ${type == "edit" ? `bg-yellow-500 hover:bg-yellow-700` : type == "add" ? `bg-green-500 hover:bg-green-700` : type == "delete" ? `bg-red-500 hover:bg-red-700` : ``} ${className}`}
      >
        {type == "view" ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        :
        type == "edit" ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        :
        type == "add" ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        : type == "delete" ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        :
          <></>
        }
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          {/* Modal Container */}
          <div
            className="relative w-11/12 sm:w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl transition-transform transform scale-100"
            // onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer text-xl"
              aria-label="Close Modal"
              id="modal-close"
            >
              ✕
            </button>

            {/* Modal Title */}
            {modalTitle && (
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {modalTitle}
              </h2>
            )}

            {/* Modal Content */}
            {
              type == "custom"
              ?
              <div>
                {children}
              </div>
              :
              type == "view"
              ?
              <div>
                <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
                {formikFields?.map((datum: any)=>{
                  return <div className="flex">
                    <div className="basis-1/2 p-2">
                      <div className="font-semibold text-gray-800">{datum?.label} : </div>
                    </div>
                    <div className="basis-1/2 p-2">
                      <div className="">{datum?.value}</div>
                    </div>
                  </div>
                })}
                </div>
              </div>
              :
              type == "add" || type == "edit"
              ?
              <div>
                <FormikForm
                  formikFields={formikFields}
                  onSubmit={onSubmit}
                  layout="sideBySide"
                />
              </div>
              :
              type == "delete"
              ?
              <div>
                <p className="mb-4">Are you sure you want to delete?</p>
                <div className="flex justify-end">
                  <button onClick={()=>{onSubmit(); closeModal()}} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 cursor-pointer flex place-content-center me-5 cursor-pointer">Confirm</button>
                  <button onClick={closeModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer flex place-content-center cursor-pointer">Cancel</button>
                </div>
              </div>
              :
              <div></div>
            }
            

          </div>

        </div>
      )}
    </>
  );
};

export default SelfContainedModal;