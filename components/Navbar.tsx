import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import GithubIcon from "@/lib/icons/github";
import { Separator } from "./ui/separator";
import TwitterIcon from "@/lib/icons/twitter";
import { ThemeSwitch } from "./ui/themeSwitch";

export default function Navbar() {
  return (
    <div className="flex flex-row justify-between pt-2 pl-8 pr-8">
      <div className="flex">
        <div className="flex justify-center items-center">
          <h5 className="text-lg font-semibold flex items-center gap-2">
            ActionG
            <span className="text-xs rounded-full bg-primary/10 px-2 py-1 w-fit">
              BETA
            </span>
          </h5>
          <Separator orientation="vertical" className="m-2 h-6" />
          <Link
            href="https://x.com/intent/tweet?text=Check%20out%20Gradii%20-%20A%20beautiful%20open-source%20gradient%20generator%20tool%0A%0Ahttps%3A%2F%2Fgithub.com%2Fkeshav-exe%2Fwallpaper-app"
            target="_blank"
          >
            <Button variant="ghost" size="icon">
              <TwitterIcon className="size-4 " />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <ThemeSwitch />
        <Separator
        orientation="vertical"
        className="m-2 h-6"
        />
        <Link
          href="https://github.com/DufferDeepu/ActionG"
          target="_blank"
        >
          <Button variant="accent">
            <GithubIcon className=" size-4" />
            Give us a star
          </Button>
        </Link>
      </div>
    </div>
  );
}
