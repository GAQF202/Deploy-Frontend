import React, { useEffect, useState, setState } from "react";
//import { Chart } from "./components/Chart";
import './App.css'
import 'c3/c3.css';
import c3 from "c3";  

import io from 'socket.io-client';

function App() {
  //const [vm1,setVm1] = ["suanfonson", 1, 200, 100, 400, 150, 250];
  //const [vm2,setVm2] = ["fuansonfon", 50, 20, 10, 40, 15, 25];
  const socket = io("http://sopes1-342703.uc.r.appspot.com/")
  const [mensajes,setMensajes] = useState([]);

  const [logs,setLogs] = useState([]);
  const [vm1,setVm1] = useState(["VM1"]);
  const [vm2,setVm2] = useState(["VM2"]);

  const[vm1Dates, setVm1Dates] = useState([]);
  const[vm2Dates, setVm2Dates] = useState([]);

  useEffect(()=>{
    socket.on('message',mensaje => {
      setMensajes([...mensajes,mensaje])
      setMensajes(mensaje)
    })
    return () => {socket.off()}
  },[mensajes])
  //console.log(mensajes)
  useEffect(()=>{
     setInterval(()=>{
      fetch("http://34.117.115.134:80/getData",{method:"GET"})
      .then((data)=>data.json())
      .then((json)=>{
        //console.log(json)
        if(json.Nombre == "VM2"){
          setVm2Dates(json)
          if(vm2.length >= 60){
            setVm2([
              ...vm2.slice(0, 1),
              ...vm2.slice(1 + 1, vm2.length)
            ]);
            //setVm2(["VM2"])
          }else{
            setVm2(vm2=>[...vm2,json?.Ram?.libre])
          }
          //console.log("aja",vm2)
        }
        if(json.Nombre == "VM1"){
          setVm1Dates(json)
          if(vm1.length >= 60){
            setVm1([
              ...vm1.slice(0, 1),
              ...vm1.slice(1 + 1, vm1.length)
            ]);
            //setVm1(["VM1"])
          }else{
            setVm1(vm1=>[...vm1,json?.Ram?.libre])
          }
          //console.log("aja",vm1)
        }
      })
      /*c3.generate({
        bindto: "#chart",
        data: {
          columns: [
            vm1,
            vm2
          ],
          type: "line",
        },
      });*/
    },3000)
  },[])

  //console.log(logs)
  //console.log("Esto",logs);

  useEffect(() => {
    c3.generate({
      bindto: "#chart",
      data: {
        columns: [
          vm1,
          vm2
        ],
        type: "line",
      },
    });
  }, [vm1,vm2]);
  
  
  return <div>
        <div id="chart" />
        <div className="div-1">
          <table className="info">
            <tr>
              <td>VM1</td>
              <td>Memoria RAM total <br/> {vm1Dates?.Ram?.total} </td>
              <td>Memoria RAM en uso <br/> {vm1Dates?.Ram?.Uso} </td>
              <td>% Uso <br/> {vm1Dates?.Ram?.PorcentajeUso} </td>
              <td>Memoria RAM libre <br/> {vm1Dates?.Ram?.libre} </td>
            </tr>
          </table>
        </div>
        <div className="div-2">
          <table className="info">
            <tr>
              <td>VM2</td>
              <td>Memoria RAM total <br/> {vm2Dates?.Ram?.total} </td>
              <td>Memoria RAM en uso <br/> {vm2Dates?.Ram?.Uso} </td>
              <td>% Uso <br/> {vm2Dates?.Ram?.PorcentajeUso} </td>
              <td>Memoria RAM libre <br/> {vm2Dates?.Ram?.libre} </td>
            </tr>
          </table>
        </div>
        <p>{logs.Nombre}</p>
        <div className="div-logs">
          <table className="table-logs">
            <th className="th-titles">
              <td>VM</td>
              <td>Fecha</td>
              <td>Endpoint</td>
              <td>Pid</td>
              <td>Nombre</td>
              <td>Estado</td>
            </th>
            {mensajes?.map(vm=>
              <tr>
                {
                  vm.cpupadre?.map(cpu=>
                    <tr>
                    <td>{vm.nombre}</td>
                    <td>{vm.fecha}</td>
                    <td>{vm.endpoint}</td>
                    <td>{cpu.pid}</td>
                    <td>{cpu.name}</td>
                    <td>{cpu.state}</td>

                    </tr>
                  )
                }
              </tr>
            )
            }
          </table>
        </div>
      </div>;
  
}

export default App;