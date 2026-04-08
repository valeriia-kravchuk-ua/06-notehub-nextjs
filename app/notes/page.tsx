import {HydrationBoundary, QueryClient} from '@tanstack/react-query';
import {dehydrate} from "@tanstack/query-core";

import NotesClient from "@/app/notes/Notes.client";
import {fetchNotes} from "@/lib/api";

type Props = {
    searchParams: { page?: string; query?: string };
};

const  Notes = async ({searchParams}: Props)=> {

    const currentPage = Number(searchParams.page) || 1;
    const query = searchParams.query || '';

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes", query, currentPage],
        queryFn: () => fetchNotes(currentPage, query),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient initialQuery={query} initialPage={currentPage} />
        </HydrationBoundary>
    )
}

export default Notes