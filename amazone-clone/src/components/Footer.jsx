function Footer() {
  return (
    <footer className="w-full mt-10 bg-[#232f3e] py-8">
      <div className="max-w-[1200px] mx-auto px-4 text-center text-white">
        <div className="flex flex-wrap justify-center gap-6 text-xs mb-4">
          <a href="#" className="hover:underline">Conditions of Use</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">About Amazon</a>
          <a href="#" className="hover:underline">Your Orders</a>
        </div>
        <div className="text-sm text-gray-300">© {new Date().getFullYear()} Amazon Clone. Built for education.</div>
      </div>
    </footer>
  );
}

export default Footer;
