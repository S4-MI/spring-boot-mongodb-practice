import { TodoList } from "@/features/todos/components/todo-list";

export default function TodosPage() {
    return (
        <div className="mx-auto w-full max-w-2xl px-6 py-10">
            <TodoList />
        </div>
    );
}
