"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
	const { isConnected } = useSocket();
	if (!isConnected) return (<Badge variant="outline" className="bg-yellow-600 border-none rounded-full w-6 h-6" />);
	return(<Badge variant="outline" className="bg-emerald-600 border-none rounded-full w-6 h-6" />);		 
}
