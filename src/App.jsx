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
// import {PrivateRoute} from "./components/PrivateRoute";
import EditForm from "./pages/EditForm";
import { PrivateRoute } from "./components/PrivateRoute";
import { GuestRoute } from "./components/GuestRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-form"
        element={
          <PrivateRoute>
            <CreateForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/forms/:id/questions"
        element={
          <PrivateRoute>
            <AddQuestions />
          </PrivateRoute>
        }
      />
      <Route path="/forms/:link" element={<PublicForm />} />
      <Route
        path="/forms/:id/responses"
        element={
          <PrivateRoute>
            <Responses />
          </PrivateRoute>
        }
      />
      <Route
        path="/forms/:id/edit"
        element={
          <PrivateRoute>
            <EditForm />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
