type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  accept?: string;
  rows?: number;
  defaultValue?: string;
  errors?: string;
  testId?: string;
};

export function FormField(props: FormFieldProps) {
  const isTextarea = props.type === 'textarea';
  const inputProps = {
    name: props.name,
    placeholder: props.placeholder,
    accept: props.accept,
    defaultValue: props.type !== 'file' ? props.defaultValue : undefined,
    'data-testid': props.testId,
    className: 'form-input',
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.name} className="form-label-text">
        {props.label}
      </label>

      {isTextarea ? (
        <textarea {...inputProps} rows={props.rows || 3} />
      ) : (
        <input {...inputProps} type={props.type} />
      )}

      {props.errors && <span className="form-error-text">{props.errors}</span>}
    </div>
  );
}
