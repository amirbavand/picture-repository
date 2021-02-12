import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Link, Switch  } from 'react-router-dom';
import main from './containers/main'
import RegisterPage from './containers/register'
import home from './containers/home'
import Login from './containers/login'
import UploadImage from './containers/uploadImage'
import Profile from './containers/profile'
import Product from './containers/productInformation'

import ImagePresentation from './containers/imagePage'
import Navbar from "./containers/Navbar/Navbar";
import {withRouter} from 'react-router'


const authPathes=['/login', '/register']


const Routes = ({location}) => (
  <div>
    {!authPathes.includes(location.pathname) && <Navbar/>}
    <Switch>

    <Route exact path="/" component={main} />
    <Route exact path="/register" component={RegisterPage} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/home" component={home} />
    <Route exact path="/uploadimage" component={UploadImage} />
    <Route exact path="/:user_name" component={ Profile} />
    <Route exact path="/:user_name/:product_id" component={Product} />
    <Route exact path="/:user_name/:product_id/:image_id" component={ImagePresentation} />


</Switch>
  </div>
)

export default withRouter(Routes)



