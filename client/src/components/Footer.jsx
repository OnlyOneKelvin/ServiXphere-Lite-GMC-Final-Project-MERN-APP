import { FaInstagram, FaLinkedin, FaTwitter, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              ServiXphere Lite
            </h3>
            <p className="text-sm">
              Connecting you with trusted service providers, fast and stress-free.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3">
              Contact
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <FaPhone className="text-gray-400" />
              <span>+234 800 000 0000</span>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3">
              Follow Us
            </h4>
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-white transition" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-white transition" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-white transition" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} ServiXphere Lite. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
