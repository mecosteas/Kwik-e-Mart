import React from 'react';
import './App.css';
import {Switch, Route, Link} from 'react-router-dom';
import Login from './pages/Login';
import Management from './pages/Management';
import Shop from './pages/Shop';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // maybe false instead of null?
  const [isManager, setIsManager] = React.useState(false);

  return (
    <div>
      <Switch>
        <Route path="/management">
          <Management isLoggedIn={isLoggedIn} isManager={isManager} />
        </Route>
        <Route path="/shop">
          <Shop isLoggedIn={isLoggedIn} />
        </Route>
        <Route path="/">
          <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
                isManager={isManager} setIsManager={setIsManager} />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
