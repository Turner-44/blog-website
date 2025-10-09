import { Button } from '@/components/shared-components/button';
import { useRef } from 'react';

type FileFormFieldProps = {
  label: string;
  name: string;
  accept?: string;
  value?: File | null;
  errors?: string;
  testId?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FileFormField(props: FileFormFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.name} className="form-label-text pt-2">
        {props.label}
      </label>

      <input
        ref={inputRef}
        id={props.name}
        name={props.name}
        type="file"
        accept={props.accept}
        data-testid={props.testId}
        onChange={props.onChange}
        hidden
      />

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          data-testid={`${props.testId}-select-btn`}
          className="Button-primary"
        >
          Select File
        </Button>
        <div>
          {props.value && (
            <p>
              <strong>{props.label}</strong> {props.value.name}
            </p>
          )}
        </div>
      </div>

      {props.errors && <span className="form-error-text">{props.errors}</span>}
    </div>
  );
}
