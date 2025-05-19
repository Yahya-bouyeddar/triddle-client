import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import AddQuestions from "./pages/AddQuestions";
import PublicForm from "./pages/PublicForm";
import Responses from "./pages/Responses";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-form" element={<CreateForm />} />
      <Route path="/forms/:id/questions" element={<AddQuestions />} />
      <Route path="/forms/:link" element={<PublicForm />} />
      <Route path="/forms/:id/responses" element={<Responses />} />
    </Routes>
  );
}

export default App;
