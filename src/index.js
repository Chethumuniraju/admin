import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Addsite  from './pages/addsite';
import Display from './pages/displayimg';
import AddBuilding from './pages/addbuild';
import Addcity from './pages/addcity';
import MaterialForm from './pages/addmaterial';
import ImageDisplay from './pages/fetchimg';
import LaborerForm from './pages/addlabour';
import LabourDetails from './pages/fetchlabous'; 
import Addlabour from './pages/fetchlabours2';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Addsite/> */}
    {/* <MaterialForm/> */}
    {/* <LaborerForm/> */}
{/* <LabourDetails labourId={4}/>    */}
 <Addlabour/> 
 {/* <Display id={7}/> */}
  </React.StrictMode>
);



