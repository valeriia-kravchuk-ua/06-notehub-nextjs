import css from "./NoteForm.module.css";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addNotes} from "@/lib/api";



interface NoteFormProps {
    onClose: () => void;
}

type Tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface NoteFormValues {
    title: string;
    content: string;
    tag: Tag;
}

const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",

};

export default function NoteForm({onClose}: NoteFormProps) {

    const FormSchema = Yup.object().shape({
        title: Yup.string()
            .min(3, "Title must be at least 3 characters")
            .max(50, "Title is too long, maximum of 50 characters")
            .required("Title is required"),
        content: Yup.string()
            .max(500, "Content is too long, maximum of 500 characters"),
        tag: Yup
            .mixed()
            .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'] as const)
            .required("Tag is required"),
    });

    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: addNotes,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
        },
    });
    const handleSubmit = (values: NoteFormValues) => {
        addMutation.mutate(values);
    };


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={FormSchema}
            onSubmit={handleSubmit}>
            <Form className={css.form}>
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input}/>
                    <ErrorMessage component="span" name="title" className={css.error}/>
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field as="textarea"
                           id="content"
                           name="content"
                           rows={8}
                           className={css.textarea}
                    />
                    <ErrorMessage component="span" name="content" className={css.error}/>
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage component="span" name="tag" className={css.error}/>
                </div>

                <div className={css.actions}>
                    <button type="button" className={css.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={false}
                    >
                        Create note
                    </button>
                </div>
            </Form>
        </Formik>

    );
}
