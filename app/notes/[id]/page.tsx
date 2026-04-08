// app/notes/[id]/page.tsx

import {getSingleNote} from "@/lib/api";
import {HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {dehydrate} from "@tanstack/query-core";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

type Props = {
    params: Promise<{ id: string }>;
};

const NoteDetails = async ({params}: Props) => {
    const {id} = await params;
    const note = await getSingleNote(id);
    console.log('NoteDetails',note);
    console.log('note id:', id);

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => getSingleNote(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient />
        </HydrationBoundary>
    )

};

export default NoteDetails;
