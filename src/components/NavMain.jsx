"use client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/Sidebar";
import { Icon } from "@iconify/react";

export function NavMain({ items }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = item.items?.some(
                        (sub) => location.pathname === sub.url
                    );
                    if (item.title === "Inventarios") {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.items?.some(
                                    (sub) => location.pathname === sub.url
                                )}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger
                                        asChild
                                        onClick={() => {
                                            if (isCollapsed) {
                                                navigate("inventario/equipos");
                                            }
                                        }}
                                    >
                                        <SidebarMenuButton tooltip={item.title} isActive={isActive} className="transition-colors">
                                            {item.icon && (
                                                <Icon icon={item.icon} className="!w-5 !h-5 mr-1"/>
                                            )}

                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => {
                                                const isActive =
                                                    location.pathname ===
                                                    subItem.url;

                                                return (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            className={`w-full font-poppins text-left px-4 py-2 text-sm transition-colors ${
                                                                isActive
                                                                    ? "bg-sidebar-accent text-white border-l-2 border-chart-light-blue"
                                                                    : "hover:bg-muted"
                                                            }`}
                                                        >
                                                            <Link
                                                                to={subItem.url}
                                                            >
                                                                <span>
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={location.pathname === item.url}
                            >
                                <Link
                                    to={item.url}
                                    className={`flex items-center w-full transition-colors ${
                                        location.pathname === item.url
                                            ? "text-white"
                                            : "hover:text-sidebar-accent"
                                    }`}
                                >
                                    {item.icon && (
                                        <Icon
                                            icon={item.icon}
                                            className="!w-5 !h-5 mr-1"
                                        />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
