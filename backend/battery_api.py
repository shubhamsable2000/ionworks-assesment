# battery_api.py

import pybamm
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationInput(BaseModel):
    temperature: float
    charge_rate: float


class ParameterizeInput(BaseModel):
    model: str
    thermal: str
    parameter_set: str
    cell_name: str


def run_simulation(temperature, charge_rate):
    model = pybamm.lithium_ion.DFN()
    param = model.default_parameter_values
    param["Ambient temperature [K]"] = temperature + 273.15  


    nominal_capacity = param["Nominal cell capacity [A.h]"]  
    applied_current = charge_rate * nominal_capacity  

    def current(t):
        if isinstance(t, np.ndarray):
            return np.full_like(t, applied_current)
        else:
            return applied_current

    param["Current function [A]"] = current

    sim = pybamm.Simulation(model, parameter_values=param)
    t_eval = np.linspace(0, 3600, 100)  

    try:
        sim.solve(t_eval)
        solution = sim.solution
    except Exception as e:
        error_message = f"Error while solving model: {e}"
        print(error_message)
        return {"error": error_message}

    try:
        time = solution["Time [s]"].entries.tolist()
        voltage = solution["Terminal voltage [V]"].entries.tolist()
    except Exception as e:
        error_message = f"Error extracting data: {e}"
        print(error_message)
        return {"error": error_message}

    return {"time": time, "voltage": voltage}


@app.post("/simulate")
async def simulate(input: SimulationInput):
    print(f"Received simulation input: {input}")
    data = run_simulation(input.temperature, input.charge_rate)
    return data

def parameterize_cell(model_type, thermal_type, parameter_set, cell_name):
    model_mapping = {
        "SPM": pybamm.lithium_ion.SPM(),
        "SPMe": pybamm.lithium_ion.SPMe(),
        "DFN": pybamm.lithium_ion.DFN(),
    }
    

    model = model_mapping.get(model_type)
    if model is None:
        raise HTTPException(status_code=400, detail=f"Invalid model type specified: {model_type}")

 
    try:
        param = pybamm.ParameterValues(parameter_set)
    except (KeyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid parameter set specified: {parameter_set}")


    thermal_param = "Thermal conductivity of current collector [W.m-1.K-1]"
    if thermal_type == "isothermal":
       
        param.update({thermal_param: 0}, check_already_exists=False)
    elif thermal_type == "lumped":
        param.update({thermal_param: 1}, check_already_exists=False)
    else:
        raise HTTPException(status_code=400, detail=f"Invalid thermal type specified: {thermal_type}")


    cell_config = {
        "cell_name": cell_name,
        "model_type": model_type,
        "thermal_type": thermal_type,
        "parameter_set": parameter_set,
        
    }

    return {"message": f"Cell '{cell_name}' parameterized successfully", "cell_config": cell_config}


@app.post("/parameterize")
async def parameterize(input: ParameterizeInput):
    print(f"Received parameterization input: {input}")
    data = parameterize_cell(input.model, input.thermal, input.parameter_set, input.cell_name)
    return data
