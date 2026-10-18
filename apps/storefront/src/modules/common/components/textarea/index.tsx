import React from "react"

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "placeholder"
> & {
  label: string
  name: string
}

// Multi-line counterpart of the Input component: same field styling and the
// same floating label (see the textarea rules in src/styles/globals.css).
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ name, label, required, rows = 3, ...props }, ref) => {
    return (
      <div className="flex relative z-0 w-full txt-compact-medium">
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder=" "
          required={required}
          className="pt-5 pb-2 block w-full px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none resize-y focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"
          {...props}
          ref={ref}
        />
        <label
          htmlFor={name}
          className="flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0 text-ui-fg-subtle"
        >
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea
