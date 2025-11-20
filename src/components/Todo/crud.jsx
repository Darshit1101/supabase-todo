import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { Plus, Trash2, ListTodo, CheckCircle2, Circle } from "lucide-react";

const Crud = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // CREATE
  const addTodo = async () => {
    if (!input.trim() || !user?.id) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: input, user_id: user.id }])
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    if (data?.[0]) {
      setTodos((prev) => [data[0], ...prev]);
    }

    setInput("");
  };

  // UPDATE (safe — no user_id needed because RLS will block others)
  const toggleComplete = async (id, current) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, is_complete: !current } : t
      )
    );

    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !current })
      .eq("id", id);

    if (error) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, is_complete: current } : t
        )
      );
    }
  };

  // DELETE
  const deleteTodo = async (id) => {
    const backup = todos.find((t) => t.id === id);

    setTodos((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) {
      setTodos((prev) => [backup, ...prev]);
    }
  };

  // FETCH only current user's todos
  useEffect(() => {
    const loadTodos = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)  // important: filter by current user
        .order("id", { ascending: false });

      if (!error) setTodos(data);
    };

    loadTodos();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg p-1 mb-6 shadow-sm border">
          <h1 className="text-3xl font-semibold text-gray-800 text-center">
            My Todo List
          </h1>
          <p className="text-gray-600 text-center">
            Welcome, {user.user_metadata.full_name}
          </p>
        </div>

        {/* Add Todo */}
        <div className="bg-white rounded-lg p-1 mb-6 shadow-sm border">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add new task..."
              className="flex-1 px-3 py-2 border rounded-md"
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
            <button
              onClick={addTodo}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Todo List */}
        {todos.length === 0 ? (
          <div className="text-center py-8">
            <ListTodo className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No tasks yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="bg-white rounded-lg p-3 border shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => toggleComplete(todo.id, todo.is_complete)}>
                      {todo.is_complete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <span className={todo.is_complete ? "line-through text-gray-400" : "text-gray-800"}>
                      {todo.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Crud;
