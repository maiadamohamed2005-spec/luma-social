"use client";

import { useMutation,
    useQueryClient
 } from "@tanstack/react-query";

 import { deleteStory } from "@/api/stories";
import { useAuth } from "@/context/AuthContext";

export const useDeleteStory=()=>{

const {token}=useAuth();
const querClient=useQueryClient();

const mutation=useMutation({
    mutationFn:(storyId:number)=>{
        if(!token)
        {
            throw new Error("Authentication required.");
    
        }
        return deleteStory(token,storyId);
    },
    
    onSuccess:async()=>{
        await querClient.invalidateQueries({
            queryKey:["stories"]
        });
    }

});

return {
    deleteStory:mutation.mutateAsync,
    isDeleting:mutation.isPending,
    error:mutation.error
};

}
