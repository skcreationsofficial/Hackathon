import React from 'react';
import { useField } from 'formik';

export interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  as?: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | string;
  placeholder?: string;
  rows?: number;
  min?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: string[] | number[];
}

const FormInput: React.FC<FieldConfig> = ({ label, as = 'input', options, rows = 4, ...props }) => {
  const [field, meta] = useField(props.name);
  const baseClass = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500';

  const generateTimeSlots = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const hour = 9 + index * 2;
      return `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    });
  };

  const inputClass = `${baseClass} ${meta.touched && meta.error ? 'border-red-500' : ''}`;

  const renderInput = () => {
    switch (as) {
      case 'textarea':
        return (
          <textarea
            id={props.name}
            {...field}
            {...props}
            rows={rows}
            className={inputClass}
          />
        );
      case 'select':
        return (
          <select id={props.name} {...field} {...props} className={inputClass}>
            <option value="">Select</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={props.name}
              type="checkbox"
              {...field}
              {...props}
              className="mr-2"
            />
            <label htmlFor={props.name}>{label}</label>
          </div>
        );
      case 'radio':
        return (
          <div className="flex flex-row space-x-4">
            {options?.map((opt) => (
              <label key={opt} className="flex items-center space-x-2" htmlFor={`${props.name}-${opt}`}>
                <input
                  id={`${props.name}-${opt}`}
                  type="radio"
                  {...field}
                  value={opt}
                  checked={field.value === opt}
                  className="accent-blue-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );
      default:
        if (props.name === 'date') {
          return (
            <input
              id={props.name}
              type="date"
              {...field}
              {...props}
              className={inputClass}
            />
          );
        }
        if (props.name === 'time') {
          return (
            <select id={props.name} {...field} {...props} className={inputClass}>
              <option value="">Select Time</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            id={props.name}
            {...field}
            {...props}
            className={inputClass}
          />
        );
    }
  };

  return (
    <div>
      {as !== 'checkbox' && label && (
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {renderInput()}
      {meta.touched && meta.error && (
        <div role="alert" className="text-red-500 text-sm mt-1">
          {meta.error}
        </div>
      )}
    </div>
  );
};

export default FormInput;