"use client";

import ChatScreen from "@/components/ChatScreen";
import SideBar from "@/components/SideBar";
import { Input } from "@/components/ui/input";
import useInitialFetch from "@/customhooks/useInitialFetch";
import Loading from "@/components/Loading";
import { SocketProvider } from "@/providers/SocketProvider";
import { useContext, useEffect } from "react";
import { Context } from "@/providers/globalProvider";
import SearchResultScreen from "@/components/SearchResultScreen";

const page = () => {
  const userLoading = useInitialFetch();
  const context = useContext(Context);
  const controller = new AbortController();
  useEffect(() => {
    console.log("In useEffect for searching a user (useEffect)");
    const fetchUser = async () => {
      console.log("Now fetching users  for searching a user (backend)");
      try {
        let data = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/${process.env.NEXT_PUBLIC_API}/${context.user?.id}/${context.search}`,
          {
            signal: controller.signal,
          }
        );
        let userData = await data.json();
        console.log(userData);
        context.setSearchFriends(userData.users);
      } catch (error) {
        console.log(error);
      }
    };
    if (!context.search) {
      context.setSearchFriends([]);
    }
    if (context.search.length > 2) {
      fetchUser();
    }
  }, [context.search]);
  return (
    <SocketProvider>
      <div className="flex h-[calc(100vh-72px)] w-full gap-3 p-2">
        {userLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading size={10} />
          </div>
        ) : (
          <>
            <div className="flex flex-col w-1/3 border rounded-md border-black dark:border-white">
              <form className="p-2 z-0">
                <Input
                  type="search"
                  placeholder="search..."
                  className="bg-transparent"
                  onChange={(e) => context.setSearch(e.target.value)}
                  value={context.search}
                />
              </form>
              {context.search.length > 0 ? <SearchResultScreen /> : <SideBar />}
            </div>
            <div className="w-full flex flex-col gap-3 ">
              <ChatScreen />
            </div>
          </>
        )}
      </div>
    </SocketProvider>
  );
};

export default page;
