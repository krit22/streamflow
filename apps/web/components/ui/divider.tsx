export function Divider() {
  return (
    <div className="relative my-10 flex items-center">
      <div className="grow border-t border-surface-container" />
      <span className="px-4 font-label-md text-[10px] uppercase tracking-widest text-secondary-fixed-dim">
        Or continue with
      </span>
      <div className="grow border-t border-surface-container" />
    </div>
  );
}
