import React, { useEffect, useState } from "react";

import { getFromLocalStorage } from "helpers/storage";
import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { registerIntercepts, setAuthHeaders } from "apis/axios";
import { initializeLogger } from "common/logger";
import Login from "components/Authentication/Login";
import Signup from "components/Authentication/Signup";
import PrivateRoute from "components/Common/PrivateRoute";
import Dashboard from "components/Dashboard";
import MyPreferences from "components/MyPreferences";
import PageLoader from "components/PageLoader";
import CreateTask from "components/Tasks/CreateTask";
import EditTask from "components/Tasks/EditTask";
import ShowTask from "components/Tasks/ShowTask";

const App = () => {
  const [loading, setLoading] = useState(true);
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken) && authToken !== "null";

  useEffect(() => {
    initializeLogger();
    registerIntercepts();
    setAuthHeaders(setLoading);
  }, []);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer />
      <Switch>
        <Route exact path="/tasks/:slug/edit" component={EditTask} />
        <Route exact path="/tasks/:slug/show" component={ShowTask} />
        <Route exact path="/tasks/create" component={CreateTask} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/my/preferences" component={MyPreferences} />
        <PrivateRoute
          path="/"
          redirectRoute="/login"
          condition={isLoggedIn}
          component={Dashboard}
        />
      </Switch>
    </Router>
  );
};

export default App;
