"use client";

import {useEffect, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {fetchNotes} from "@/lib/api";
import {toast, Toaster} from "react-hot-toast";
import css from "@/app/notes/page.module.css";
import SearchBox from "@/app/components/SearchBox/SearchBox";
import Pagination from "@/app/components/Pagination/Pagination";
import Modal from "@/app/components/Modal/Modal";
import NoteForm from "@/app/components/NoteForm/NoteForm";
import NoteList from "@/app/components/NoteList/NoteList";
import { useDebouncedCallback } from 'use-debounce';
 // Усю клієнтську логіку (отримання списку нотаток за допомогою useQuery та їх відображення)
// винесіть в окремий файл компонента app/notes/Notes.client.tsx.

const  NotesClient = ()=> {
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const {data, isLoading, isError, isSuccess} = useQuery({
        queryKey: ['notes', query, currentPage],
        queryFn: () => fetchNotes(currentPage, query),
        placeholderData: keepPreviousData,
    });

    const notes = data?.notes ?? [];
    const totalPages = data?.totalPages ?? 0;


    useEffect(() => {
        if (isLoading) {
            toast.loading("Loading...", {id: "notes-loading"});
        }

        if (!isLoading) {
            toast.dismiss("notes-loading");
        }

        if (isError) {
            toast.error("Error loading notes");
        }

    }, [isLoading, isError]);


    const handleClose = () => {
        setOpen(false);
    }


    const debounced = useDebouncedCallback(
        (text) => {
            setQuery(text);
            setCurrentPage(1)
        },
        1000
    );

    return (
        <>
            <section className={css.app}>

                <SearchBox onChange={debounced}/>
                {isSuccess && totalPages > 1 && (
                    <Pagination
                        pageCount={totalPages}
                        forcePage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                )}
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                <button onClick={() => setOpen(true)} className={css.button}>Create note +</button>
                {open && <Modal onClose={handleClose} children={<NoteForm onClose={handleClose}/>}/>}

                {!isLoading && query && notes.length === 0 && (
                    <p className={css.empty}>Oops… nothing found 😢</p>
                )}
                {isSuccess && <NoteList notes={notes}/>}
            </section>
        </>
    )
}

export default NotesClient