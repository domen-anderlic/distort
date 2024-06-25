"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { ShieldCheck, ShieldAlert, MoreVertical, ShieldQuestion, Shield, Check, Gavel, Loader2 } from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"></ShieldCheck>,
    "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500"></ShieldAlert>
}

export const MembersModal = () => {
    
    const router = useRouter();
    const { isOpen, onOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = isOpen && type === "members";
    const {server} = data as { server: ServerWithMembersWithProfiles };

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try{
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                   serverId: server?.id, 
                }
            });

            const response = await axios.patch(url, {role});
            router.refresh();

            onOpen("members", { server: response.data });


        } catch(error){
            console.log(error);
        } finally{
            setLoadingId("");
        }
    }

    const onKick = async (memberId: string) => {
        try{
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });
            const response = await axios.delete(url);

            router.refresh();
            onOpen("members", {server: response.data});
        } catch(error){
            console.log(error);
        } finally{
            setLoadingId("");
        }
    }
    return(
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Upravljaj člane
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length}
                        {
                            {
                                1 : " član",
                                2 : " člana",
                                3 : " člani",
                                4 : " člani",
                                5 : " članov",
                                0 : " članov",
                                6 : " članov",
                                7 : " članov",
                                8 : " članov",
                                9 : " članov",
                            }[server?.members?.length]
                        }
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl}></UserAvatar>
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center gap-x-1">
                                    {member.profile.username}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-4 w-4 text-zinc-500"></MoreVertical>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex itmes-center">
                                                    <ShieldQuestion className="w-4 h-4 mr-2"></ShieldQuestion>
                                                    <span>Vloga</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                                            <Shield className="h-4 w-4 mr-2"></Shield>
                                                            Gost
                                                            {(member.role === "GUEST" && (
                                                                <Check className="h-4 w-4 ml-auto"></Check>
                                                            )) }
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                                            <ShieldCheck className="h-4 w-4 mr-2"></ShieldCheck>
                                                            Moderator
                                                            {(member.role === "MODERATOR" && (
                                                                <Check className="h-4 w-4 ml-auto"></Check>
                                                            )) }
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator></DropdownMenuSeparator>
                                                <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                    <Gavel className="h-4 w-4 mr-2"></Gavel>
                                                    Izključi
                                                </DropdownMenuItem>
                                            
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {(loadingId === member.id) && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"></Loader2>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}