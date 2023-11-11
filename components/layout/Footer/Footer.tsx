import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="mt-4 block px-5 lg:hidden">
        <div className="flex flex-col gap-5">
          {/* <Image
            src="/logo.png"
            alt="hawkstars"
            height="200"
            width="200"
          ></Image> */}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-10">
          <Menus />
        </div>
      </div>
      <div className="mt-10 flex flex-col px-5 pb-10 lg:mt-0 lg:flex-row lg:gap-1 lg:border-t lg:px-10 lg:pt-1">
        <p className="text-sm">
          {" "}
          {"Built with <3 by "}
          <Link
            href={"https://www.linkedin.com/in/pcardosolei/"}
            className="underline"
            target="_blank"
          >
            @Paulo Cardoso
          </Link>
        </p>
      </div>
    </footer>
  );
};

const Menus = () => {
  // const router = useRouter();

  return (
    <>
      {/* {MenuSections.map((section, index) => {
        const { title, options } = section;
        return (
          <div
            key={index}
            className="text-terciary-100 ml-0 text-left lg:text-left"
          >
            <h3 className="mb-1 text-base font-semibold lg:mb-3 lg:text-lg lg:font-bold">
              {t(title)}
            </h3>
            {options.map((option, index) => (
              <div className="py-1" key={index}>
                <Link
                  href={option.url || HOME_URL}
                  className={classNames({
                    "text-disabled": option.disabled,
                  })}
                >
                  {t(option.label)}
                </Link>
              </div>
            ))}
          </div>
        );
      })} */}
    </>
  );
};

export default Footer;
