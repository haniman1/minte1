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
    "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black";

  const variants = {
    primary:
      "bg-[#D4AF37] text-black hover:bg-[#F0C830] hover:shadow-[0px_0px_30px_10px] hover:shadow-[#D4AF37]/40 shadow-[#D4AF37]/30",
    secondary:
      "bg-transparent border border-slate-600 hover:bg-slate-800 text-white",
    outline:
      "border border-[#D4AF37]/60 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
