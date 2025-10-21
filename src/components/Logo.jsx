const Logo = ({ className = "", width = "auto", height = "40px" }) => {
  return (
    <img 
      src="/img/logoclinica.png"
      alt="AdoPets Logo" 
      className={className}
      style={{ width, height }}
    />
  );
};

export default Logo;
