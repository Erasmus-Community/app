"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { APP_HOME_URL } from "../../urls";
import Input from "@/components/utils/Input/Input";
import Button from "@/components/utils/Button/Button";

const LoginPage = () => {
  const router = useRouter();
  const [type, setType] = useState<"register" | "login">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const { register, loginWithFacebook, loginWithGoogle } = useUserService();

  // /** registar com google */
  // const registerWithGoogle = async (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   await loginWithGoogle();
  // };

  // const registerWithFacebook = async (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   await loginWithFacebook();
  // };

  // const normalRegister = async (event: React.FormEvent) => {
  //   event.preventDefault();

  //   const { error } = await register(email, password);

  //   if (error) {
  //     return;
  //   } else {
  //     router.push(APP_HOME_URL);
  //   }
  // };

  return (
    <div className="max-width my-10 flex justify-center">
      <div className="my-5 w-11/12 rounded-lg border border-terciary-100 lg:w-7/12">
        <div className="grid grid-cols-2 justify-around border-b border-terciary-100">
          <div className="border-l border-terciary-100 p-3 text-center text-primary-500">
            {/* {t("register")} */}
          </div>
        </div>
        <div className="mt-9 px-10 py-5">
          <form onSubmit={() => {}}>
            <div className="mt-3">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                labelText="Email:"
              ></Input>
            </div>
            <div className="mt-3">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                labelText="password"
              ></Input>
            </div>
            <div className="my-5 w-full">
              <Button type="submit">Register</Button>
            </div>
          </form>

          <div className="flex flex-1 flex-col justify-around gap-5">
            <Button
              variant="facebook"
              // onClick={(event) => registerWithFacebook(event)}
              type={"button"}
            >
              {/* <SiFacebook className="inline " color="blue" size={36} /> */}
              <span className="my-auto ml-3 inline">
                {/* {t("continue_with")} Facebook */}
              </span>
            </Button>
            <Button
              variant="gmail"
              // onClick={(event) => registerWithGoogle(event)}
              type={"button"}
            >
              {/* <SiGmail color="red" className="inline" size={36} /> */}
              <span className="my-auto ml-3 inline">
                {/* {t("continue_with")} Google */}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
