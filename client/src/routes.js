import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch  } from 'react-router-dom';
import main from './containers/main'
import RegisterPage from './containers/register'
import home from './containers/home'
import Login from './containers/login'
import registerLogin from './containers/registerLogin'
import UploadImage from './containers/uploadImage'
import Profile from './containers/profile'









const Routes = () => (
    <Router>
        <Switch>

            <Route exact path="/" component={main} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={home} />
            <Route exact path="/reglogin" component={registerLogin} />
            <Route exact path="/uploadimage" component={UploadImage} />
            <Route path="/:user_name" component={Profile} />







        </Switch>


    </Router>
);

export default Routes;
