import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/images/EventSwiftLogo_Secondary.svg";


const Footer = () => {
    return (
      <footer className="bg-purple-600">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-col justify-center w-auto text-teal-600 sm:justify-start">
            <Link href="/" className="flex">
                        <Image
                            src={Logo}
                            width={50} 
                            height={50}
                            alt="Event Swift Logo"
                        />
                    </Link>
              <p className="mt-4 text-center text-sm text-white lg:mt-0 lg:text-right grid-flow-col">
                Copyright © {new Date().getFullYear()} - All right reserved
              </p>
            </div>
            
            <div
            className="flex flex-row justify-evenly"
            >
                <div className="px-3">
                <a
                  className="text-amber-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-amber-500"
                  href="#"
                >
                About Us
                </a>
                </div>
  <div className="px-3">
            <a
                  className="text-amber-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-amber-500"
                  href="#"
                >
                  Terms
                </a>
                </div>
                <div className="px-3">
                <a
                  className="text-amber-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-amber-500"
                  href="#"
                >
                  Privacy policy
                </a>
                </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;