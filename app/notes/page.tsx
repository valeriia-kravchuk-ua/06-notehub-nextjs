import {HydrationBoundary, QueryClient} from '@tanstack/react-query';
import {dehydrate} from "@tanstack/query-core";

import NotesClient from "@/app/notes/Notes.client";
import {fetchNotes} from "@/lib/api";

// Реалізуйте сторінковий компонент Notes у маршруті /notes як SSR-компонент, д
// е заздалегідь виконується prefetch (попереднє завантаження даних через TanStack Query)
// з гідратацією кешу.
type Props = {
    params: Promise<{ currentPage: number, query:string }>;
};
const  Notes = async ({params}: Props)=> {
    const {currentPage, query} = await params;
    const notes = await fetchNotes(currentPage, query);
    console.log('notes',notes);
    console.log('currentPage, query',currentPage, query);

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes", query, currentPage],
        queryFn: () => fetchNotes(currentPage, query),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient />
        </HydrationBoundary>
    )
}

export default Notes