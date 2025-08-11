import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/Sidebar";

export function CicataSidebarHeader() {
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex w-full items-center justify-center mt-5">
          <img
            src={"/Logo.png"}
            alt="CICATA Logo"
            className={
              isCollapsed ? "h-10 w-18 object-contain" : "h-12 object-contain"
            }
          />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
