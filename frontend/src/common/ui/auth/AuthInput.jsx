const AuthInput = ({ icon, ...props }) => {
  return (
    <div className="
      flex items-center px-3 rounded-lg
      bg-white/10 border border-white/10
      focus-within:border-indigo-400/50
      transition-all
    ">
      <div className="text-gray-300 mr-2">{icon}</div>
      <input
        {...props}
        className="
          w-full p-3 bg-transparent outline-none
          text-white placeholder-gray-400
        "
      />
    </div>
  );
};

export default AuthInput