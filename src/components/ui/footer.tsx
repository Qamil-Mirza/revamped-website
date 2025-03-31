export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-4 mt-auto border-t border-black/10 dark:border-white/10 bg-backgroundColor dark:bg-backgroundDark">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          {/* Copyright */}
          <div className="text-sm text-primaryText/70 dark:text-white/70">
            © {currentYear} Qamil Mirza. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
