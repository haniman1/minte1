import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary", // primary | secondary | outline
  size = "md", // sm | md | lg
  className = "",
  to, // if provided, renders as Link
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";

  const variants = {
    primary:
      "bg-white text-black hover:bg-slate-100 hover:shadow-[0px_0px_30px_14px] hover:shadow-white/50 shadow-white/30",
    secondary:
      "bg-transparent border border-slate-600 hover:bg-slate-800 text-white",
    outline: "border border-white/70 hover:bg-white/10 text-white",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // If 'to' prop is passed, render as Link (for navigation)
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  // Otherwise render as normal button
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
