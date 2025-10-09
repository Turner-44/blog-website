type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  errors?: string;
  testId?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export function FormField(props: FormFieldProps) {
  const isTextarea = props.type === 'textarea';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.name} className="form-label-text">
        {props.label}
      </label>

      {isTextarea ? (
        <textarea
          id={props.name}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          data-testid={props.testId}
          rows={props.rows ?? 3}
          className="form-input"
        />
      ) : (
        <input
          id={props.name}
          name={props.name}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          data-testid={props.testId}
          className="form-input"
        />
      )}
      {props.errors && <span className="form-error-text">{props.errors}</span>}
    </div>
  );
}
