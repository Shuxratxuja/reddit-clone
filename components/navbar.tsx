import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import * as actions from '@/actions'
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import { auth } from "@/auth";
import Image from "next/image";
import { path } from "@/helpers/path";

export const Navbar = async () => {

  const session = await auth()

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-gray-100 dark:bg-gray-800 border-0",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search Reddit"
      startContent={
        <SearchIcon className="text-base text-gray-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <p className="font-bold text-inherit text-xl">reddit</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex-1 justify-center">
        {searchInput}
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitch />
        <Popover placement="bottom-end">
          <PopoverTrigger>
            {!session?.user ? (
              <form action={actions.signIn}>
                <Button type="submit" color="primary" className="bg-orange-500 hover:bg-orange-600">
                  Sign in
                </Button>
              </form>
            ) : (
              <Button
                variant="light"
                className="p-0 min-w-0 w-8 h-8"
              >
                <Image
                  className="rounded-full"
                  height={32}
                  width={32}
                  alt={session?.user?.name || ''}
                  src={session?.user?.image || ''}
                />
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2">
              <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
                <Image
                  className="rounded-full"
                  height={32}
                  width={32}
                  alt={session?.user?.name || ''}
                  src={session?.user?.image || ''}
                />
                <div>
                  <p className="font-semibold text-sm">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
              </div>
              <form action={actions.signOut}>
                <Button type="submit" color="default" variant="light" className="w-full justify-start">
                  Sign out
                </Button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={path.home()}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
