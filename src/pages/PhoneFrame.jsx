export default function PhoneFrame({ children }) {
  return (
    <>
   
    
    <div className="flex-1 flex justify-center items-start p-8">
     
      {/* Phone Frame */}
      <div className="w-[375px] h-[700px] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-black flex flex-col">
        {children}
      </div>
     
    </div>
    
    </>
  );
}
