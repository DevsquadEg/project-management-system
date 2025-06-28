import type { UseFormRegister } from "react-hook-form";

const CustomInput = ({
  type,
  placeholder,
  label,
  validation,
  register,
  registeredTitle,
  errorMessage,
}: {
  type: string;
  placeholder: string;
  label: string;
  validation: { required: string; pattern: { value: RegExp; message: string } };
  register: UseFormRegister<{ [registeredTitle: string]: string }>;
  registeredTitle: string;
  errorMessage: string;
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={registeredTitle} className="form-label fw-normal">
        {label}
      </label>

      <div className="border-bottom d-flex align-items-center pb-1">
        <div className="input-group">
          <input
            id={registeredTitle}
            type={type}
            placeholder={placeholder}
            {...register(registeredTitle, validation)}
            className="form-control custom-input"
          />
        </div>
      </div>
      <span className="text-danger">{errorMessage}</span>
    </div>
  );
};

export default CustomInput;
