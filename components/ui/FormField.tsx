import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-deep/15 bg-white px-4 py-3.5 text-deep placeholder:text-deep/35 focus:outline-none focus:border-teal transition-colors";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input className={cn(fieldBase, className)} {...rest} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea className={cn(fieldBase, "resize-none", className)} {...rest} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <select className={cn(fieldBase, className)} {...rest}>
      {children}
    </select>
  );
}
